import { Meta, Story } from '@storybook/react'
import SidebarCard, { ISidebarCardProps } from 'components/SidebarCard'
import React from 'react'
import GlobalStyle from 'utils/style/global'

export default {
  title: 'Components/SidebarCard',
  component: SidebarCard,
} as Meta

const Template: Story<ISidebarCardProps> = (args) => (
  <>
    <GlobalStyle />
    <SidebarCard {...args} />
  </>
)
// what are those primary.args?
/*
  The args object act as the props passed to this component.
  As explained in Heading.stories.tsx:27, we may create multiple stories and every story gets its own set of props via the args ex.

  export const Primary = Template.bind({})
  Primary.args = {
    address: 'address',
    company: 'NA',
    country: 'at',
    date: 'date',
    id: 'id',
  }

  export const Secondary = Template.bind({})
  Secondary.args = {
    address: 'secondary address',
    company: 'secondary company',
    country: 'at',
    date: 'secondary  date',
    id: 'secondary  id',
  }
*/
export const Primary = Template.bind({})
Primary.args = {
  address: 'address',
  company: 'NA',
  country: 'at',
  date: 'date',
  id: 'id',
}
