import { toast } from 'react-hot-toast';

export const useNotifications = () => {
  const success = (message: string) => {
    toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  const promise = (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => {
    toast.promise(promise, messages);
  };

  return { success, error, promise };
};
