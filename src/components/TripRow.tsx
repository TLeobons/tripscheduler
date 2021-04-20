import ArrowRight from 'assets/ArrowRight.svg'
import RemoveIcon from 'assets/Remove.svg'
import { TripContext } from 'contexts/TripContext'
import { HTMLMotionProps, motion, useAnimation } from 'framer-motion'
import React, { FC, useContext, useState } from 'react'
import Modal from 'react-modal'
import { api } from 'services/httpService'
import styled from 'styled-components'
import { FlagMap } from 'utils/FlagMap'
import { customStyles } from 'utils/style/customStyles'
import { device } from 'utils/style/responsive'
import Anchor from './Anchor'
import SVGIcon from './SVGIcon'

// what is this HTMLMotionProps being extended?
/*
  Because in pages/index.tsx:25 the initial prop was being passed to this component, 
  hence the TripRow components must be able to accept those props, 
  and since this is a framer-motion prop, those props must be extended in the ITripRowProps.
  But since these motion props are not being used in the TripRow component both the extends HTMLMotionProps<'div'> and initial={{ y: -250 }} can be removed safely.
*/
export interface ITripRowProps extends HTMLMotionProps<'div'> {
  country: string
  company: string
  date: Date | string
  id: string
  address: string
}
const TripRow: FC<ITripRowProps> = ({ country, company, date, id, address }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  // whats this [1] in the useContext?
  /*
    You're getting the 1th element from the array returned by useContext(TripContext).
    ex:

    *const [, dispatch] = useContext(TripContext)
    here you're doing a destructured assignment, and you're skipping the first element as you don't need it.
    Another approach is to directly assign the 1th element from the array to the assignment variable like below.

    *const dispatch = useContext(TripContext)[1]
  */
  const dispatch = useContext(TripContext)[1]
  const animation = useAnimation()

  // what is this as keyof typeof FlagMap?
  /*
    Because the country prop is of string type, it creates a type collision when trying to use it as the key of the FlagMap object. 
    So, in order to prevent this type of collision, we make a type conversion using the as keyof typeof FlagMap.
    Now, the flag variable is of the correct type and can be used as the key inside FlagMap object.

    To understand how this works, let's break it down.
    The FlagMap is a const object.
    The typeof FlagMap gives us the type of the structure of the FlagMap object.
    And since It's an object It must have a key-value pair type data structure.
    So, in order to get the keys of the FlagMap object, we use keyof typeof FlagMap.

    [Read about keyof here](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

    [Read about typeof here](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
  */
  const flag = country.toLowerCase().split(' ').join('-') as keyof typeof FlagMap
  const image = FlagMap[flag].icon

  const removeTrip = async (id: string) => {
    try {
      await api.delete(`/trip/${id}`)
      setIsOpen(false)
      dispatch({ type: 'REMOVE_TRIP', payload: id })
    } catch (error) {
      alert('Something went wrong while deleting trip')
      console.log(error.message) //dlme
    }
  }

  // why await the animation then below call it again without awaiting?
  /*
    The animation.start method returns a promise. 
    So, if don't await the promise, the sequence method will start two animations simultaneously. 
    In order to avoid that, we wait for the first animation to finish using await, 
    only then we start our second animation.
  */
  async function sequence() {
    await animation.start({ y: 70, transition: { duration: 0.2 } })
    animation.start({ y: 0, transition: { duration: 0.2 } })
  }

  Modal.setAppElement('div')

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        // why these customStyles exported an all the others in the same module as styled-components, what does it do?
        /*
          The customStyles object was being used in more the one place, 
          so it was better to create and export it from one place, and import, 
          where needed, rather than having duplicated all around the codebase.
        */
        style={customStyles}
        // whats this?
        /*
          This is an aria attribute used by a screen reader.

          [Read More](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)
        */
        ariaHideApp={false}
        onRequestClose={() => setIsOpen(false)}
      >
        <Form
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* q?? */}
          {/*
            That is your code from the original sundayfix project.

            [Check it out](https://github.com/TLeobons/sundayfix/blob/4d881807952e9cbf771d16eafe1c6bbc9a416276/src/components/TripRow.jsx#L95)
          */}
          <Label htmlFor='q'>Are you sure you want to delete this trip?</Label>
          <FormButtonGroup>
            <AcceptDeleteButton
              onClick={() => removeTrip(id)}
              whileHover={{
                scale: 1.15,
                translateY: -10,
                boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
              }}
            >
              Delete
            </AcceptDeleteButton>
            <AcceptCancelButton
              onClick={() => setIsOpen(false)}
              whileHover={{
                scale: 1.15,
                translateY: -10,
                boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
              }}
            >
              Cancel
            </AcceptCancelButton>
          </FormButtonGroup>
        </Form>
      </Modal>
      <TripRowStyles
        initial={{ y: -200 }}
        animate={animation}
        onLoad={sequence}
        // ariaHideApp={false}
        whileHover={{ boxShadow: '2px 6px 10px rgba(0,0,0,0.3)' }}
      >
        <FlagColumn>
          <SVGIcon icon={image} width={32} height={32} style={{ marginLeft: 0 }} />
          <MobileCountry>{country}</MobileCountry>
        </FlagColumn>

        <TripColumn>
          <TripRowInline>
            <Anchor href={`/viewTrip/${id}`}>
              <Country style={{ color: 'black' }}>{FlagMap[flag].country}</Country>
            </Anchor>
            <Separator />
            <TripDate>
              <MobileLabel>Date</MobileLabel>
              <strong>
                <div className='innerWrapper'>{date}</div>
              </strong>
            </TripDate>
          </TripRowInline>
          <TripRowInline>
            <Company style={{ color: 'black' }}>
              <MobileLabel>Company</MobileLabel>
              {company}
            </Company>
            <Separator />
            <Address>
              <div className='innerWrapper'>{address}</div>
            </Address>
          </TripRowInline>
        </TripColumn>
        <ActionButtons>
          <RemoveButton
            onClick={() => setIsOpen(true)}
            whileHover={{
              scale: 1.05,
              translateY: -5,
              boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            <SVGIcon icon={RemoveIcon} width={11} height={16} />
          </RemoveButton>
          <Anchor href={`/editTrip/${id}`}>
            <ViewButton
              whileHover={{
                scale: 1.05,
                translateY: -5,
                boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <MobileLabel>View Trip</MobileLabel>
              <SVGIcon icon={ArrowRight} width={16} height={10} />
            </ViewButton>
          </Anchor>
        </ActionButtons>
      </TripRowStyles>
    </div>
  )
}

export default TripRow

const Label = styled.label`
  display: block;
  font-size: 1.9rem;
  margin-bottom: 2rem;
  color: black;
  display: block;
  text-align: center;
  width: 100%;
`

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  align-items: center;
`
const FormButtonGroup = styled.div`
  flex-direction: row;
`

const AcceptDeleteButton = styled(motion.div)`
  background: red;
  font-size: 1.6rem;
  padding: 1.3rem 2rem;
  margin: 1.2rem;
  max-width: 200px;
  border-radius: 10px;
  font-weight: 600;
  text-align: left;
  display: inline-block;
  align-items: center;
  cursor: pointer;
  color: white;

  > svg {
    margin-left: auto;
  }
`

const AcceptCancelButton = styled(motion.div)`
  background: #cccccc;
  font-size: 1.6rem;
  padding: 1.3rem 2rem;
  max-width: 200px;
  margin: 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  text-align: left;
  display: inline-block;
  align-items: center;
  cursor: pointer;
  color: white;

  > svg {
    margin-left: auto;
  }
`

const TripRowStyles = styled(motion.div)`
  background: #f9f9fa;
  padding: 2rem;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 2rem;

  @media ${device.tablet} {
    display: block;
  }
`

const TripColumn = styled.div`
  margin-right: 2rem;
  min-width: 0;
  width: 100%;

  @media ${device.tablet} {
    display: flex;
    flex-direction: column-reverse;
    margin-right: 0;
  }
`

const TripRowInline = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex: 1;

  &:last-child {
    margin: 0;
  }

  @media ${device.tablet} {
    margin-bottom: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`

const Separator = styled.div`
  width: 1px;
  margin: 0 2rem;
  height: 10px;
  background: #e4e4e5;
  position: relative;
  top: 2px;

  @media ${device.tablet} {
    display: none;
  }
`

const FlagColumn = styled.div`
  display: block;
  margin-right: 2rem;

  @media ${device.tablet} {
    display: flex;
    align-items: center;
    margin: 0;

    > div {
      margin-left: 2rem;
      font-weight: 600;
    }
  }
`

const MobileCountry = styled.div`
  display: none;

  @media ${device.tablet} {
    display: block;
  }
`

const Country = styled.div`
  font-weight: 600;
  white-space: nowrap;

  @media ${device.tablet} {
    display: none;
  }
`

const Company = styled.div`
  font-size: 1.5rem;
  white-space: nowrap;

  @media ${device.tablet} {
    font-weight: 600;
  }
`

const MobileLabel = styled.div`
  display: none;

  @media ${device.tablet} {
    display: block;

    margin-top: 2rem;
    font-size: 1.2rem;
    color: #63666a;
    margin-bottom: 1rem;
    font-weight: 400;
  }
`

const TripDate = styled.div`
  font-size: 1.4rem;
  color: #97999b;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 0;
  position: relative;
  height: 16px;
  width: 100%;

  > div.innerWrapper {
    display: inline-block;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  @media ${device.tablet} {
    color: black;
    order: 2;
  }
`

const Address = styled.div`
  font-size: 1.4rem;
  color: #97999b;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 0;
  position: relative;
  height: 16px;
  width: 100%;

  > div {
    display: inline-block;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  @media ${device.tablet} {
    color: black;
    order: 1;
    line-height: 1.5;
    width: 100% !important;
    white-space: inherit;
    text-overflow: inherit;
  }
`

const ActionButtons = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`

const RemoveButton = styled(motion.button)`
  background: #fbebe9;
  padding: 1.6rem 2rem;
  border-radius: 10px;
  margin-left: 2rem;
  cursor: pointer;

  @media ${device.tablet} {
    display: none;
  }
`

const ViewButton = styled(motion.button)`
  background: #f1f1f2;
  padding: 1.6rem 2rem;
  border-radius: 10px;
  margin-left: 2rem;
  cursor: pointer;

  @media ${device.tablet} {
    display: flex;
    margin: 0;
    width: 100%;
    align-items: center;
    margin-top: 3rem;

    > div {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
    }

    > svg {
      margin-left: auto;
    }
  }
`
