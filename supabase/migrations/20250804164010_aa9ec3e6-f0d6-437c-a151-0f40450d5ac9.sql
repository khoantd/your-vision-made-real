-- Drop the trigger first, then recreate the function with proper search_path
DROP TRIGGER IF EXISTS update_conversation_on_message_change ON public.messages;
DROP FUNCTION IF EXISTS public.update_conversation_timestamp();

CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Update the conversation's updated_at when a message is added/updated
  UPDATE conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_conversation_on_message_change
AFTER INSERT OR UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_timestamp();