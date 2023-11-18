import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { cn } from '../../_lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpPage() {
  const { signUp, authUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm();
  const onSubmit = async ({
    displayName,
    email,
    password
  }: {
    displayName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    await signUp(displayName, email, password, () => {
      navigate('/');
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (authUser != null) {
      navigate('/');
    }
  });

  return (
    <form
      className='auth-container flex flex-col gap-4 max-w-[350px] w-full p-8 rounded-xl'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className='text-lg font-semibold mb-2'>Sign Up</h2>
      <input
        disabled={isLoading}
        className={cn(
          'form-input',
          errors.displayName && 'border border-red-500'
        )}
        placeholder='Display Name'
        {...register('displayName', {
          required: true,
          minLength: 3,
          maxLength: 16
        })}
      />
      <input
        disabled={isLoading}
        className={cn('form-input', errors.email && 'border border-red-500')}
        placeholder='Email'
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      <input
        disabled={isLoading}
        className={cn('form-input', errors.password && 'border border-red-500')}
        type='password'
        placeholder='Password'
        {...register('password', {
          required: true,
          minLength: 8,
          maxLength: 100
        })}
      />
      <input
        disabled={isLoading}
        className={cn(
          'form-input',
          errors.confirmPassword && 'border border-red-500'
        )}
        type='password'
        placeholder='Confirm Password'
        {...register('confirmPassword', {
          required: true,
          validate: (value) => value === getValues('password')
        })}
      />
      <div className='flex flex-col gap-3 mb-2'>
        <button disabled={isLoading} className='button submit-button'>
          Sign Up
        </button>
        <Link className='text-center' to='/sign-in'>
          Sign In
        </Link>
      </div>
    </form>
  );
}
