import { Input } from '@nextui-org/react'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState, FC } from 'react'


interface IProps {
  name: string
  label: string
}
const PasswordInput: FC<IProps> = ({ name, label }) => {

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <label className='' htmlFor={name}>{label}</label>
        <Input
          isRequired={true}
          name={name}
          type={isVisible ? "text" : "password"}
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
          endContent={
            <button type="button" onClick={() => setIsVisible(!isVisible)}>
              {!isVisible ? (
                <EyeOff color="#6b6666" />
              ) : (
                <Eye color="#6b6666" />
              )}
            </button>
          }
        />
    </>
  )
}

export default PasswordInput