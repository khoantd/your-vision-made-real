import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, Info, Loader2 } from 'lucide-react';

export const useNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-green-200 bg-green-50 text-green-900",
      action: <CheckCircle className="w-5 h-5 text-green-600" />
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
      action: <XCircle className="w-5 h-5" />
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-yellow-200 bg-yellow-50 text-yellow-900",
      action: <AlertCircle className="w-5 h-5 text-yellow-600" />
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-blue-200 bg-blue-50 text-blue-900",
      action: <Info className="w-5 h-5 text-blue-600" />
    });
  };

  const showLoading = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-gray-200 bg-gray-50 text-gray-900",
      action: <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />,
      duration: 0 // Don't auto-dismiss loading toasts
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  };
};

// API Key validation notification hook
export const useAPIKeyValidation = () => {
  const { showError, showSuccess, showWarning } = useNotifications();

  const handleAPIKeyError = (error: any) => {
    if (error?.error?.code === "invalid_api_key") {
      showError(
        "Invalid API Key",
        "Please check your API key in settings. You can find your API key at platform.openai.com."
      );
    } else {
      showError(
        "API Connection Failed",
        "Failed to connect to AI service. Please check your settings."
      );
    }
  };

  const handleAPIKeySuccess = () => {
    showSuccess(
      "API Key Validated",
      "Successfully connected to AI service."
    );
  };

  return {
    handleAPIKeyError,
    handleAPIKeySuccess
  };
};