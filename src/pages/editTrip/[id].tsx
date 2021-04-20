import Check from 'assets/Check.svg'
import Anchor from 'components/Anchor'
import {
  AcceptDeleteButton,
  Button,
  Container,
  DatePickerWrap,
  DPDown,
  Form,
  FormButtonGroup,
  FormContent,
  FormFooter,
  FormGroup,
  FormInnerGroup,
  InnerForm,
  Label,
  LabelQuestion,
  Main,
  RadioButton,
  RadioButtonGroup,
  StyledLoader,
} from 'components/common'
import Input from 'components/FormComponents/Input'
import Heading from 'components/Heading'
import Sidebar from 'components/Sidebar'
import SidebarCard from 'components/SidebarCard'
import SVGIcon from 'components/SVGIcon'
import { TripContext } from 'contexts/TripContext'
import moment from 'moment'
import { GetServerSideProps, NextPage } from 'next'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Modal from 'react-modal'
import { api } from 'services/httpService'
import { customStyles } from 'utils/style/customStyles'

// what is the NextPage?
/*
  The NextPage is a typescript type given to us by next.js to properly type a page component, 
  which is different from a regular React component living inside the components directory.
*/
const EditTrip: NextPage<{ id: string }> = ({ id }) => {
  const [state, dispatch] = useContext(TripContext)

  const xValues = [5000, -40, 0]
  const [modalIsOpen, setIsOpen] = useState(false)
  const setEndDateMin = useState(
    state.form.start_date !== '' ? moment(state.form.start_date).add(1, 'day').toDate() : '',
  )[1]
  const [endDateVal, setEndDateVal] = useState(
    state.form.end_date !== '' ? moment(state.form.end_date).toDate() : '',
  )

  useEffect(() => {
    const fetchTrip = async () => {
      const { data } = await api.get(`/trip/${id}`)
      dispatch({ type: 'SET_FORM', payload: data })
    }
    fetchTrip()
  }, [id, dispatch])

  const editTrip = async () => {
    try {
      const response = await api.put(`/trip/${id}`, state.form)
      dispatch({ type: 'EDIT_TRIP', payload: response.data })
      setIsOpen(true)
    } catch (e) {
      console.error(e)
    }
  }

  let startDate =
    state.form.start_date !== '' ? moment(state.form.start_date, 'YYYY-MM-DD').toDate() : ''

  return (
    <Container>
      <Main>
        <Heading title='Edit trip' />
        <Modal isOpen={modalIsOpen} style={customStyles} onRequestClose={() => setIsOpen(false)}>
          <Form
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* q?? */}
            {/*
              Again, your code not mine.

              [Check it out here](https://github.com/TLeobons/sundayfix/blob/4d881807952e9cbf771d16eafe1c6bbc9a416276/src/pages/EditTrip.jsx#L90)
            */}
            <Label htmlFor='q' style={{ textAlign: 'center' }}>
              Trip modified Successfully
            </Label>
            <FormButtonGroup>
              <Anchor href='/'>
                <AcceptDeleteButton
                  whileHover={{
                    scale: 1.15,
                    translateY: -10,
                    boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
                  }}
                >
                  OK
                </AcceptDeleteButton>
              </Anchor>
            </FormButtonGroup>
          </Form>
        </Modal>
        <Form>
          <FormContent>
            <InnerForm>
              <FormGroup>
                {/* what are those xValues?? */}
                {/*
                  The xValues is an array of values used by framer-motion to animate a component on the x-axis, ex:

                  const xValues = [5000, -40, 0]
                  ...

                  <DPDown animate={{ x: xValues }} transition={{ duration: 1 }}>
                  ...
                  </DPDown>

                  This tells framer-motion to start the element on the x-axis at 5000 px, then animate it to the -50 px position, 
                  then end the animation at 0 px position, giving this element a nice spring-like animation.
                */}
                <DPDown animate={{ x: xValues }} transition={{ duration: 1 }}>
                  <Label htmlFor='countries'>Where do you want to go</Label>
                  <Dropdown
                    // required
                    className={`flag-${state.form.address.country}`}
                    // id='country'
                    // name='country'
                    options={state.countries}
                    placeholder={state.form.address.country || 'Select country'}
                    value={state.form.address.country}
                    onChange={(data: { value: string }) => {
                      dispatch({
                        type: 'SET_SELECTED_COUNTRY',
                        payload: data.value,
                      })
                    }}
                  />
                </DPDown>
              </FormGroup>

              <FormGroup>
                <FormInnerGroup
                  animate={{ x: xValues, opacity: [0, 0.3, 1] }}
                  transition={{ duration: 1, delay: 0.1 }}
                >
                  <Label htmlFor='startDate'>Start date</Label>
                  <DatePickerWrap>
                    <DatePicker
                      required
                      // what does the line below do?
                      /*
                        It's a simple type checking because the selected prop is of type Date | undefined 
                        we check the type of the startDate variable if it is of type string we use undefined as the value for this prop, 
                        else we use startDate as the value for this prop.
                      */
                      selected={typeof startDate === 'string' ? undefined : startDate}
                      onChange={(date) => {
                        // why date as any?
                        /*
                          The any type convert a variable that can be assigned or assigned to any type, 
                          without any type collision, this is commonly used in places where the type on not known.

                          [Read More](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)
                        */
                        let nextDay = moment(date as any)
                          .add(1, 'day')
                          .toDate()
                        setEndDateMin(nextDay)
                        if (moment(state.form.end_date) <= moment(date as any)) {
                          setEndDateVal('')
                          dispatch({
                            type: 'SET_EndDate',
                            payload: {
                              end_date: '',
                            },
                          })
                        }
                        dispatch({
                          type: 'SET_StartDate',
                          payload: {
                            start_date: moment(date as any).format('YYYY-MM-DD'),
                          },
                        })
                      }}
                      // date
                      id='startDate'
                      name='startDate'
                      placeholderText='dd. mm. year'
                      showPopperArrow={false}
                      selectsStart
                      showMonthYearDropdown
                      dateFormat='dd. MM. yyyy'
                      minDate={moment().toDate()}
                    />
                  </DatePickerWrap>
                </FormInnerGroup>

                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.2 }}>
                  <Label htmlFor='endDate'>End date</Label>
                  <DatePickerWrap>
                    <DatePicker
                      required
                      selected={typeof endDateVal === 'string' ? undefined : endDateVal}
                      onChange={(date) => {
                        setEndDateVal(moment(date as any).toDate())
                        dispatch({
                          type: 'SET_EndDate',
                          payload: {
                            end_date: moment(date as any).format('YYYY-MM-DD'),
                          },
                        })
                      }}
                      id='endDate'
                      name='endDate'
                      placeholderText='dd. mm. year'
                      dateFormat='dd. MM. yyyy'
                      minDate={typeof endDateVal === 'string' ? undefined : endDateVal}
                      showTwoColumnMonthYearPicker
                      showPopperArrow={false}
                    />
                  </DatePickerWrap>
                </FormInnerGroup>
              </FormGroup>

              <FormGroup>
                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.3 }}>
                  <Input
                    name='company'
                    label='Company name'
                    value={state.form.company_name}
                    placeholder='Type here ...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'SET_CompanyName',
                        payload: {
                          company_name: e.target.value,
                        },
                      })
                    }}
                  />
                </FormInnerGroup>

                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.4 }}>
                  <Input
                    name='city'
                    label='City'
                    value={state.form.address.city}
                    placeholder='Type here ...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'SET_CITY',
                        payload: {
                          address: {
                            city: e.target.value,
                          },
                        },
                      })
                    }}
                  />
                </FormInnerGroup>

                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.5 }}>
                  <Input
                    name='street'
                    label='Street'
                    value={state.form.address.street}
                    placeholder='Type here ...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'SET_Street',
                        payload: {
                          address: {
                            street: e.target.value,
                          },
                        },
                      })
                    }}
                  />
                </FormInnerGroup>

                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.6 }}>
                  <Input
                    name='streetNumber'
                    label='Street Number'
                    placeholder='Type here ...'
                    value={state.form.address.street_num}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'SET_StreetNumber',
                        payload: {
                          address: {
                            street_num: Number(e.target.value),
                          },
                        },
                      })
                    }}
                  />
                </FormInnerGroup>

                <FormInnerGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.7 }}>
                  <Input
                    name='zipCode'
                    label='Zip code'
                    value={state.form.address.zip}
                    placeholder='Type here ...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: 'SET_ZIP',
                        payload: {
                          address: {
                            zip: e.target.value,
                          },
                        },
                      })
                    }}
                  />
                </FormInnerGroup>
              </FormGroup>

              <FormGroup>
                <LabelQuestion>
                  Have you been recently tested for <strong>COVID-19</strong>
                </LabelQuestion>

                <RadioButtonGroup animate={{ x: xValues }} transition={{ duration: 1, delay: 0.8 }}>
                  <RadioButton>
                    <input
                      required
                      type='radio'
                      name='testedCovid'
                      id='yes'
                      value='0'
                      checked={state.form.covid === true}
                      onChange={() => {
                        dispatch({
                          type: 'SET_Covid',
                          payload: {
                            covid: true,
                          },
                        })
                      }}
                    />
                    <div />
                    <span>Yes</span>
                  </RadioButton>

                  <RadioButton>
                    <input
                      required
                      type='radio'
                      name='testedCovid'
                      id='no'
                      value='1'
                      checked={state.form.covid === false}
                      onChange={() => {
                        dispatch({
                          type: 'SET_Covid',
                          payload: {
                            covid: false,
                          },
                        })
                      }}
                    />
                    <div />
                    <span>No</span>
                  </RadioButton>
                </RadioButtonGroup>
              </FormGroup>
            </InnerForm>
          </FormContent>

          <FormFooter>
            <Button type='button' onClick={editTrip}>
              Save
              <SVGIcon icon={Check} width={16} height={12} />
            </Button>
          </FormFooter>
        </Form>
      </Main>
      <Sidebar sidebarHeading='Trips'>
        {state.trips.length > 0 ? (
          state.trips.map((trip: any) => (
            <SidebarCard
              key={trip.id}
              country={trip.address.country}
              company={trip.company_name}
              address={`${trip.address.street} ${trip.address.street_num} ${trip.address.zip} ${trip.address.city}`}
              date={`${moment(trip.start_date).format('D MMM')} - ${moment(trip.end_date).format(
                'D MMM, YYYY',
              )}`}
              id={trip.id}
            />
          ))
        ) : (
          <StyledLoader type='BallTriangle' color='var(--accent)' />
        )}
      </Sidebar>
    </Container>
  )
}

export default EditTrip
// what is the function below doing?
/*
  This function is used for SSR, and it receives the path parameter for the current page, ex:
  the current file is pages/editTrip/[id].tsx, this file is a next.js page, that has a path param named id. 
  So, the getServerSideProps method exported from this file will be called with the id path param that is used to fetch the relevant data for the current page.

  [Read More](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)
*/
export const getServerSideProps: GetServerSideProps<any, any> = async ({ params: { id } }) => {
  return {
    props: {
      id,
    },
  }
}
