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
import { LLM_PROVIDERS, MODELS_BY_PROVIDER } from "@/constants/models";

export const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "openai">("google");
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash-exp");
  const [toolsOpen, setToolsOpen] = useState(true);
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
  const [functionCallingOpen, setFunctionCallingOpen] = useState(false);
  const [functions, setFunctions] = useState<any[]>([
    {
      id: 1,
      name: "get_weather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA"
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit"
          }
        },
        required: ["location"]
      }
    }
  ]);
  const [selectedFunction, setSelectedFunction] = useState<any>(null);
  const [newFunctionName, setNewFunctionName] = useState("");
  const [newFunctionDescription, setNewFunctionDescription] = useState("");
  const [newFunctionParams, setNewFunctionParams] = useState(`{
  "type": "object",
  "properties": {},
  "required": []
}`);

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
        {/* Provider Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            LLM Provider
          </label>
          <Select 
            value={selectedProvider} 
            onValueChange={(value: "google" | "openai") => {
              setSelectedProvider(value);
              // Auto-select first model of the new provider
              const firstModel = MODELS_BY_PROVIDER[value][0].value;
              setSelectedModel(firstModel);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LLM_PROVIDERS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Model
          </label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS_BY_PROVIDER[selectedProvider].map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Key */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            API Key
          </label>
          <Input
            type="password"
            placeholder={`Enter ${selectedProvider === 'google' ? 'Google' : 'OpenAI'} API key`}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Required for {selectedProvider === 'google' ? 'Google' : 'OpenAI'} models
          </p>
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
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer hover:bg-accent/50 rounded-md p-1 -m-1 transition-colors"
            onClick={() => setToolsOpen(!toolsOpen)}
          >
            <h3 className="text-sm font-medium text-foreground">Tools</h3>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                toolsOpen ? 'rotate-0' : '-rotate-90'
              }`} 
            />
          </div>
          {toolsOpen && (
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">Function calling</span>
                <Dialog open={functionCallingOpen} onOpenChange={setFunctionCallingOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Configure Function Calling</DialogTitle>
                      <DialogDescription>
                        Define custom functions that the AI can call to perform specific tasks.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Function List */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-foreground">
                            Available Functions ({functions.length})
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (newFunctionName.trim()) {
                                const newFunction = {
                                  id: Date.now(),
                                  name: newFunctionName,
                                  description: newFunctionDescription || "No description provided",
                                  parameters: JSON.parse(newFunctionParams)
                                };
                                setFunctions([...functions, newFunction]);
                                setNewFunctionName("");
                                setNewFunctionDescription("");
                                setNewFunctionParams(`{
  "type": "object",
  "properties": {},
  "required": []
}`);
                              }
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Function
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                          {functions.map((func) => (
                            <div
                              key={func.id}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                selectedFunction?.id === func.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                              }`}
                              onClick={() => setSelectedFunction(func)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-foreground">{func.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{func.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {Object.keys(func.parameters.properties || {}).length} params
                                    </Badge>
                                    <Badge variant={func.parameters.required?.length > 0 ? "destructive" : "secondary"} className="text-xs">
                                      {func.parameters.required?.length || 0} required
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFunctions(functions.filter(f => f.id !== func.id));
                                    if (selectedFunction?.id === func.id) {
                                      setSelectedFunction(null);
                                    }
                                  }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add New Function Form */}
                      <div className="border rounded-md p-4 bg-muted/20">
                        <h4 className="font-medium text-sm text-foreground mb-3">Add New Function</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Function Name
                            </label>
                            <Input
                              placeholder="e.g., calculate_total"
                              value={newFunctionName}
                              onChange={(e) => setNewFunctionName(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Description
                            </label>
                            <Input
                              placeholder="What does this function do?"
                              value={newFunctionDescription}
                              onChange={(e) => setNewFunctionDescription(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-xs font-medium text-foreground mb-1 block">
                            Parameters Schema
                          </label>
                          <Textarea
                            value={newFunctionParams}
                            onChange={(e) => setNewFunctionParams(e.target.value)}
                            className="font-mono text-xs min-h-20"
                            placeholder="JSON schema for function parameters"
                          />
                        </div>
                      </div>

                      {/* Function Details Editor */}
                      {selectedFunction && (
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm text-foreground">
                              Edit Function: {selectedFunction.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(selectedFunction, null, 2));
                              }}
                              className="text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-foreground mb-1 block">
                                Function Name
                              </label>
                              <Input
                                value={selectedFunction.name}
                                onChange={(e) => {
                                  const updated = { ...selectedFunction, name: e.target.value };
                                  setSelectedFunction(updated);
                                  setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                }}
                                className="text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-foreground mb-1 block">
                                Description
                              </label>
                              <Input
                                value={selectedFunction.description}
                                onChange={(e) => {
                                  const updated = { ...selectedFunction, description: e.target.value };
                                  setSelectedFunction(updated);
                                  setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                }}
                                className="text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-foreground mb-1 block">
                                Parameters Schema
                              </label>
                              <Textarea
                                value={JSON.stringify(selectedFunction.parameters, null, 2)}
                                onChange={(e) => {
                                  try {
                                    const params = JSON.parse(e.target.value);
                                    const updated = { ...selectedFunction, parameters: params };
                                    setSelectedFunction(updated);
                                    setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                  } catch (error) {
                                    // Handle invalid JSON
                                  }
                                }}
                                className="font-mono text-xs min-h-32"
                              />
                            </div>

                            {/* Parameter Helper Buttons */}
                            <div>
                              <label className="text-xs font-medium text-foreground mb-2 block">
                                Quick Add Parameters
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const params = { ...selectedFunction.parameters };
                                    params.properties = params.properties || {};
                                    params.properties.query = {
                                      type: "string",
                                      description: "Search query"
                                    };
                                    const updated = { ...selectedFunction, parameters: params };
                                    setSelectedFunction(updated);
                                    setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                  }}
                                  className="text-xs"
                                >
                                  + Query
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const params = { ...selectedFunction.parameters };
                                    params.properties = params.properties || {};
                                    params.properties.limit = {
                                      type: "number",
                                      description: "Maximum number of results"
                                    };
                                    const updated = { ...selectedFunction, parameters: params };
                                    setSelectedFunction(updated);
                                    setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                  }}
                                  className="text-xs"
                                >
                                  + Limit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const params = { ...selectedFunction.parameters };
                                    params.properties = params.properties || {};
                                    params.properties.options = {
                                      type: "array",
                                      items: { type: "string" },
                                      description: "List of options"
                                    };
                                    const updated = { ...selectedFunction, parameters: params };
                                    setSelectedFunction(updated);
                                    setFunctions(functions.map(f => f.id === updated.id ? updated : f));
                                  }}
                                  className="text-xs"
                                >
                                  + Array
                                </Button>
                              </div>
                            </div>

                            {/* Validation */}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                try {
                                  JSON.parse(JSON.stringify(selectedFunction.parameters));
                                  alert("Function schema is valid!");
                                } catch (e) {
                                  alert("Invalid function schema: " + e.message);
                                }
                              }}
                              className="w-full"
                            >
                              Validate Function
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Function Templates */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Function Templates
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = {
                                id: Date.now(),
                                name: "search_database",
                                description: "Search through database records",
                                parameters: {
                                  type: "object",
                                  properties: {
                                    query: { type: "string", description: "Search query" },
                                    table: { type: "string", description: "Database table name" },
                                    limit: { type: "number", description: "Max results", default: 10 }
                                  },
                                  required: ["query", "table"]
                                }
                              };
                              setFunctions([...functions, template]);
                            }}
                            className="text-xs"
                          >
                            Database Search
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = {
                                id: Date.now(),
                                name: "send_email",
                                description: "Send an email message",
                                parameters: {
                                  type: "object",
                                  properties: {
                                    to: { type: "string", description: "Recipient email" },
                                    subject: { type: "string", description: "Email subject" },
                                    body: { type: "string", description: "Email content" }
                                  },
                                  required: ["to", "subject", "body"]
                                }
                              };
                              setFunctions([...functions, template]);
                            }}
                            className="text-xs"
                          >
                            Send Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = {
                                id: Date.now(),
                                name: "calculate_math",
                                description: "Perform mathematical calculations",
                                parameters: {
                                  type: "object",
                                  properties: {
                                    expression: { type: "string", description: "Math expression to evaluate" },
                                    precision: { type: "number", description: "Decimal precision", default: 2 }
                                  },
                                  required: ["expression"]
                                }
                              };
                              setFunctions([...functions, template]);
                            }}
                            className="text-xs"
                          >
                            Math Calculator
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const template = {
                                id: Date.now(),
                                name: "api_request",
                                description: "Make HTTP API request",
                                parameters: {
                                  type: "object",
                                  properties: {
                                    url: { type: "string", description: "API endpoint URL" },
                                    method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE"] },
                                    headers: { type: "object", description: "Request headers" },
                                    body: { type: "object", description: "Request body" }
                                  },
                                  required: ["url", "method"]
                                }
                              };
                              setFunctions([...functions, template]);
                            }}
                            className="text-xs"
                          >
                            API Request
                          </Button>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFunctionCallingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setFunctionCallingOpen(false)}>
                        Save Functions
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
          )}
        </div>

        {/* Advanced Settings */}
        <div>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer hover:bg-accent/50 rounded-md p-1 -m-1 transition-colors"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            <h3 className="text-sm font-medium text-foreground">Advanced settings</h3>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                advancedOpen ? 'rotate-0' : '-rotate-90'
              }`} 
            />
          </div>
          {advancedOpen && (
          <div className="space-y-4">
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
          </div>
          )}
        </div>
      </div>
    </div>
  );
};