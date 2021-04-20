import React from 'react'

interface ISVGIconProps {
  //* The `icon` prop is used to pass the icon that will be used as img src.
  icon: any
  width?: number
  height?: number
  //* The `style` prop is used to pass the additional styles that will be applied to the `img` element
  style?: React.CSSProperties
}

//* The `forwardRef` function forwards the ref passed by the parent component to this component.

// why 2 types passed as generics below?
/*
  The forwardRef function receives 2 params, the first parameter is the element Type that the ref will be forwarded to,
  the second parameter is the props type of this component.
*/
const SVGIcon = React.forwardRef<HTMLImageElement, ISVGIconProps>(
  ({ icon, width = 40, height = 40, style = {} }, ref) => {
    return (
      <img
        src={icon}
        width={width}
        height={height}
        style={{ margin: 0, marginLeft: 'auto', ...style }}
        ref={ref}
      />
    )
  },
)

export default SVGIcon
