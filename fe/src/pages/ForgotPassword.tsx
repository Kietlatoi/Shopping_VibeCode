import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailCheck } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Bạn quên nhập email rồi.').email('Email chưa hợp lệ.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [sentEmail, setSentEmail] = useState('');
  const { success: notifySuccess } = useNotifications();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await apiService.forgotPassword(values.email);
    } catch {
      // Keep the account enumeration-safe UX even if email delivery is not configured locally.
    }

    setSentEmail(values.email);
    notifySuccess('Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Lấy lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập email tài khoản, tụi mình sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
          </CardDescription>
        </CardHeader>

        {sentEmail ? (
          <CardContent className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Kiểm tra hộp thư của bạn nhé</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nếu {sentEmail} có tài khoản trên hệ thống, email hướng dẫn sẽ đến trong vài phút.
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full">Quay lại đăng nhập</Button>
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi hướng dẫn'}
              </Button>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Tôi nhớ mật khẩu rồi
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
