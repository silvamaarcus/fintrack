import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PasswordInput = forwardRef((props, ref) => {
  const placeholder = props.placeholder || 'Digite sua senha';
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleVisibilityToggle = (e) => {
    e.preventDefault();
    setPasswordVisible((prev) => !prev);
  };
  return (
    <div className="relative">
      <Input
        type={passwordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
      <Button
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
        onClick={handleVisibilityToggle}
      >
        {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
