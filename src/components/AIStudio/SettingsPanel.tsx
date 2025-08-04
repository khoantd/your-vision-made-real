import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronRight, Wrench, Plus, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { CHAT_MODELS } from "@/constants/models";

export const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [temperature, setTemperature] = useState([1]);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [codeExecution, setCodeExecution] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [googleSearch, setGoogleSearch] = useState(false);
  const [urlContext, setUrlContext] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [topP, setTopP] = useState([0.95]);
  const [topK, setTopK] = useState([40]);
  const [maxTokens, setMaxTokens] = useState([8192]);
  const [frequencyPenalty, setFrequencyPenalty] = useState([0]);
  const [presencePenalty, setPresencePenalty] = useState([0]);
  const [stopSequences, setStopSequences] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [apiTimeout, setApiTimeout] = useState([30]);
  const [streaming, setStreaming] = useState(true);
  const [logProbabilities, setLogProbabilities] = useState(false);
  const [structuredOutputOpen, setStructuredOutputOpen] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");
  const [jsonSchema, setJsonSchema] = useState(`{
  "type": "object",
  "properties": {
    "response": {
      "type": "string",
      "description": "The main response"
    }
  },
  "required": ["response"]
}`);
  const [schemaTemplates] = useState([
    {
      name: "Simple Response",
      schema: `{
  "type": "object",
  "properties": {
    "response": {
      "type": "string",
      "description": "The main response"
    }
  },
  "required": ["response"]
}`
    },
    {
      name: "Classification",
      schema: `{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["positive", "negative", "neutral"]
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "reasoning": {
      "type": "string"
    }
  },
  "required": ["category", "confidence"]
}`
    },
    {
      name: "Data Extraction",
      schema: `{
  "type": "object",
  "properties": {
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "type": {"type": "string"},
          "value": {"type": "string"}
        }
      }
    },
    "summary": {
      "type": "string"
    }
  },
  "required": ["entities"]
}`
    }
  ]);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Wrench className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-settings-bg border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-medium text-foreground">Run settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Model Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Model
          </label>
          <Select defaultValue={CHAT_MODELS[0].value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAT_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token Count */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Token count
          </label>
          <p className="text-sm text-muted-foreground">0 / 1,048,576</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Temperature
          </label>
          <div className="px-2">
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span className="font-medium">{temperature[0]}</span>
              <span>2</span>
            </div>
          </div>
        </div>

        {/* Media Resolution */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Media Resolution
          </label>
          <Select defaultValue="default">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thinking Section */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Thinking</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Thinking mode</span>
              <Switch checked={thinkingMode} onCheckedChange={setThinkingMode} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Set thinking budget</span>
              <Switch checked={thinkingBudget} onCheckedChange={setThinkingBudget} />
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Tools</h3>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">Structured output</span>
                <Dialog open={structuredOutputOpen} onOpenChange={setStructuredOutputOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Configure Structured Output</DialogTitle>
                      <DialogDescription>
                        Define the structure and format for AI responses using JSON Schema.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Output Format Selection */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Output Format
                        </label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="yaml">YAML</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Schema Templates */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Quick Templates
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {schemaTemplates.map((template, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => setJsonSchema(template.schema)}
                              className="text-xs"
                            >
                              {template.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* JSON Schema Editor */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-foreground">
                            JSON Schema
                          </label>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                try {
                                  const formatted = JSON.stringify(JSON.parse(jsonSchema), null, 2);
                                  setJsonSchema(formatted);
                                } catch (e) {
                                  // Handle invalid JSON
                                }
                              }}
                              className="text-xs"
                            >
                              Format
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(jsonSchema)}
                              className="text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={jsonSchema}
                          onChange={(e) => setJsonSchema(e.target.value)}
                          className="font-mono text-sm min-h-48"
                          placeholder="Enter your JSON schema here..."
                        />
                      </div>

                      {/* Schema Validation */}
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            try {
                              JSON.parse(jsonSchema);
                              alert("Valid JSON Schema!");
                            } catch (e) {
                              alert("Invalid JSON Schema: " + e.message);
                            }
                          }}
                          className="w-full"
                        >
                          Validate Schema
                        </Button>
                      </div>

                      {/* Common Properties Helper */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Common Properties
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = JSON.parse(jsonSchema);
                              current.properties = current.properties || {};
                              current.properties.timestamp = {
                                type: "string",
                                format: "date-time"
                              };
                              setJsonSchema(JSON.stringify(current, null, 2));
                            }}
                            className="text-xs"
                          >
                            + Timestamp
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = JSON.parse(jsonSchema);
                              current.properties = current.properties || {};
                              current.properties.confidence = {
                                type: "number",
                                minimum: 0,
                                maximum: 1
                              };
                              setJsonSchema(JSON.stringify(current, null, 2));
                            }}
                            className="text-xs"
                          >
                            + Confidence
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = JSON.parse(jsonSchema);
                              current.properties = current.properties || {};
                              current.properties.tags = {
                                type: "array",
                                items: { type: "string" }
                              };
                              setJsonSchema(JSON.stringify(current, null, 2));
                            }}
                            className="text-xs"
                          >
                            + Tags Array
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = JSON.parse(jsonSchema);
                              current.properties = current.properties || {};
                              current.properties.metadata = {
                                type: "object",
                                additionalProperties: true
                              };
                              setJsonSchema(JSON.stringify(current, null, 2));
                            }}
                            className="text-xs"
                          >
                            + Metadata
                          </Button>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStructuredOutputOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setStructuredOutputOpen(false)}>
                        Save Schema
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Switch checked={structuredOutput} onCheckedChange={setStructuredOutput} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Code execution</span>
              <Switch checked={codeExecution} onCheckedChange={setCodeExecution} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-foreground">Function calling</span>
                <Button variant="ghost" size="sm" className="ml-2 text-xs text-muted-foreground">
                  Edit
                </Button>
              </div>
              <Switch checked={functionCalling} onCheckedChange={setFunctionCalling} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Grounding with Google Search</span>
              <Switch checked={googleSearch} onCheckedChange={setGoogleSearch} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">URL context</span>
              <Switch checked={urlContext} onCheckedChange={setUrlContext} />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-sm text-foreground">
              Advanced settings
              {advancedOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Top P */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Top P
              </label>
              <div className="px-2">
                <Slider
                  value={topP}
                  onValueChange={setTopP}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="font-medium">{topP[0]}</span>
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* Top K */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Top K
              </label>
              <div className="px-2">
                <Slider
                  value={topK}
                  onValueChange={setTopK}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span className="font-medium">{topK[0]}</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Max Tokens
              </label>
              <div className="px-2">
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  max={32768}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span className="font-medium">{maxTokens[0]}</span>
                  <span>32K</span>
                </div>
              </div>
            </div>

            {/* Frequency Penalty */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Frequency Penalty
              </label>
              <div className="px-2">
                <Slider
                  value={frequencyPenalty}
                  onValueChange={setFrequencyPenalty}
                  max={2}
                  min={-2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>-2</span>
                  <span className="font-medium">{frequencyPenalty[0]}</span>
                  <span>2</span>
                </div>
              </div>
            </div>

            {/* Presence Penalty */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Presence Penalty
              </label>
              <div className="px-2">
                <Slider
                  value={presencePenalty}
                  onValueChange={setPresencePenalty}
                  max={2}
                  min={-2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>-2</span>
                  <span className="font-medium">{presencePenalty[0]}</span>
                  <span>2</span>
                </div>
              </div>
            </div>

            {/* Stop Sequences */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Stop Sequences
              </label>
              <Input
                placeholder="Enter stop sequences (comma separated)"
                value={stopSequences}
                onChange={(e) => setStopSequences(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Custom System Prompt
              </label>
              <Textarea
                placeholder="Enter custom system prompt..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="text-sm min-h-20"
              />
            </div>

            {/* API Timeout */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                API Timeout (seconds)
              </label>
              <div className="px-2">
                <Slider
                  value={apiTimeout}
                  onValueChange={setApiTimeout}
                  max={300}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5s</span>
                  <span className="font-medium">{apiTimeout[0]}s</span>
                  <span>5m</span>
                </div>
              </div>
            </div>

            {/* Advanced Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Streaming</span>
                <Switch checked={streaming} onCheckedChange={setStreaming} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Log probabilities</span>
                <Switch checked={logProbabilities} onCheckedChange={setLogProbabilities} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};