'use client';
import { Icons } from '@/components/Icons';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  AuthCredentialsType,
  AuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

// https://github.com/react-hook-form/resolvers

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentialsType>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { data } = trpc.anyApiRoute.useQuery();
  console.log(data);

  const onSubmitHandler = ({
    email,
    password,
  }: AuthCredentialsType) => {
    console.log({ email, password });
  };

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='ma-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='w-20 h-20' />
            <h1 className='text-2xl font-bold'>Create an account</h1>
            <Link
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5',
              })}
              href='/sign-in'
            >
              Already have an account? Sign in
              <ArrowRight className='h-4 2-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
            <form action='' onSubmit={handleSubmit(onSubmitHandler)}>
              <div className='grid gap-2'>
                <div className='grid gap-2.5 py-2'>
                  <Label htmlFor='email'>Email</Label>

                  <Input
                    {...register('email')}
                    className={cn({
                      'focus-visible:ring-red-500': errors.email,
                    })}
                    placeholder='you@example.com'
                  />
                  {/* {errors.email && <div> {errors.email}</div>} */}
                </div>

                <div className='grid gap-2.5 py-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    {...register('password')}
                    className={cn({
                      'focus-visible:ring-red-500': true,
                    })}
                    placeholder='Password'
                  />
                </div>
              </div>
              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;

// 22:53:21