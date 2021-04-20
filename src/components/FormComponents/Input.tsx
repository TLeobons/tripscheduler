import { Input as FormInput, Label } from 'components/common'
import React, { FC } from 'react'

interface IInputProps {
  label: string
}

//* A Component wrapper that provides label as well as input
//* The `Parameters<T>` gets the parameter list of the function type T
//* And `Parameters<typeof FormInput>[0]` gets the 0th element from the parameter list, so basically it gets the type of props from `FormInput`

// why the [0], not all of the elements in the array?
/*
Because a functional component in react only receives a single parameter that is its props, 
and since it only receives a single parameter it will be at the 0th position, for ex:

function foo(param1: number, param2: string) {
  ...
}

*Now if we do this
type Params = Parameters<typeof foo>
*then
type Params = [number, string]

*And, If we do this
type Params = Parameters<typeof foo>[0]
*then
type Params = number


*So, when I use Parameters<typeof FormInput>[0] we are getting the type of the first parameter of the function FormInput, which is equivalent to the props type of the FormInput component.

[Read More](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
*/
const Input: FC<Parameters<typeof FormInput>[0] & IInputProps> = (props) => {
  const { label, name } = props
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <FormInput required id={name} name={name} {...props} />
    </>
  )
}

export default Input
