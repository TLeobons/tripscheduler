import Link, { LinkProps } from 'next/link'
import React from 'react'

// what is this Omit being extended?
/*
Omit is a Typescript generic type that allows us to remove some fields from a type, for example:

interface A {
  field1: number
  field2: string
  field3: boolean
}
*Now if we want to create a type that does not contain `field3`, we can use Omit
type NoField3 = Omit<A, 'field3'>

type NoField3 is equals to 
interface NoField3 {
  field1: number
  field2: string
}

Another common type is the Pick generic type, 
which is used to Pick the given fields instead of removing them, 
in essence, Omit and Pick are opposite of each other. 

[Read More](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
*/
interface IAnchorProps
  extends Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    'href'
  > {
  //* This prop is required.
  href: LinkProps['href']

  //* The ? makes this prop optional, or not required
  as?: LinkProps['as']
  passHref?: LinkProps['passHref']

  //* This prop is used to check and skip the `a` tag when a custom `a` tag is passed as children.
  skipATag?: boolean
}

//* The forwardRef function forwards the ref passed by the parent component to this component.
const Anchor = React.forwardRef<any, IAnchorProps>((props, ref) => {
  const { href, as = href, passHref = false, skipATag = false, ...restProps } = props
  const { children } = restProps
  return (
    <Link href={href} as={as} passHref={passHref}>
      {skipATag ? (
        children
      ) : (
        <a {...restProps} ref={ref}>
          {children}
        </a>
      )}
    </Link>
  )
})

export default Anchor
