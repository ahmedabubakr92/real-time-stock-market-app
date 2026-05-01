import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function InputField({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) {
  return (
    <div>
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input 
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        value={value}
        className={cn("form-input", {"opacity-50 cursor-not-allowed": disabled})}
        {...register(name, validation)}
      />
      
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500">
            {error.message}
        </p>
      )}
    </div>
  );
}

export default InputField;
