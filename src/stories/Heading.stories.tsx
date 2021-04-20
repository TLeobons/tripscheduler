import { Meta, Story } from '@storybook/react'
import Heading, { IHeadingProps } from 'components/Heading'
import MenuProvider from 'contexts/MenuContext'
import React from 'react'
import GlobalStyle from 'utils/style/global'

// as Meta?
/*
  The Meta type is provided by storybook to properly type the default exported object, 
  which is the metadata to configure the stories for a component.
*/
export default {
  title: 'Components/Heading',
  component: Heading,
} as Meta

const Template: Story<IHeadingProps> = (args) => (
  <>
    <GlobalStyle />
    <MenuProvider>
      <Heading {...args} />
    </MenuProvider>
  </>
)

// why the bind below?
/*
  Because, we may wish to create multiple stories for this component, depending on the current theme, or any other parameter, ex:
  We may create two different stories for two different theme, like light mode, dark mode. 
  So, the bind function helps us create a copy of the function with empty props, then we use Primary.args to pass the props for the Primary story.
*/
export const Primary = Template.bind({})
Primary.args = {
  title: 'Title',
} as IHeadingProps
