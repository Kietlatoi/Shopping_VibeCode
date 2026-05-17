import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store';
import { apiService } from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email({ message: 'Email không hợp lệ.' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const { success: notifySuccess, error: notifyError } = useNotifications();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'buyer@vibecode.com',
      password: 'LocalSample123!',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await apiService.login(values.email, values.password);
      if (result) {
        login(result.user, result.token, result.tokenExpiresAt);
        notifySuccess('Đăng nhập thành công!');
        navigate('/');
      } else {
        notifyError('Email hoặc mật khẩu không chính xác');
        setError('root', { message: 'Email hoặc mật khẩu không chính xác' });
      }
    } catch {
      notifyError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      setError('root', { message: 'Không thể kết nối đến máy chủ' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Đăng nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu của bạn để tiếp tục</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errors.root && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                {errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

             {/* Quick Login Helper */}
             <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
               <p className="font-semibold mb-1">Tài khoản demo (mật khẩu: LocalSample123!):</p>
               <ul className="space-y-1 list-disc list-inside ml-4">
                 <li>admin@vibecode.com (Admin)</li>
                 <li>seller@vibecode.com (Seller)</li>
                 <li>buyer@vibecode.com (Buyer)</li>
               </ul>
             </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
