import { createContext, Dispatch, FC, useEffect, useReducer } from 'react'
import { api } from 'services/httpService'

const initialState = {
  trips: [] as any[],
  form: {
    address: {
      city: '',
      country: '',
      street: '',
      street_num: '',
      zip: '',
    },
    company_name: '',
    covid: null,
    covid_test_date: '',
    end_date: '',
    start_date: '',
  },
  countries: [] as any[],
  selectedCountry: '',
}

type TripPayloadDispatchAction = {
  type: string
  payload?: any
}

// what does the line below do?
/*
  The following snippet creates a type TripPalyload which is an array of two element, 
  where the 0th element is of type typeof initialState, and the 1th element is of type Dispatch<TripPayloadDispatchAction>.
*/
type TripPayload = [typeof initialState, Dispatch<TripPayloadDispatchAction>]

// what does the undefined as any do?
/*
  Since the createContext<TripPayload> function expects an initial value of type TripPayload which we can only provide on the Provider we need to pass undefined as the initial value, and since it only accepts an initial value of type TripPayload we need to convert the undefined type to TripPayload type.
  We do that with following.

  *undefined as any
*/
export const TripContext = createContext<TripPayload>(undefined as any)

// where do you get these types like TripPayloadDispatchAction from?
// I have created the TripPayloadDispatchAction type on line 24.
const reducer = (state: typeof initialState, action: TripPayloadDispatchAction) => {
  switch (action.type) {
    case 'SET_INITIAL':
      return {
        trips: [...state.trips],
        form: {
          address: {
            city: '',
            country: '',
            street: '',
            street_num: '',
            zip: '',
          },
          company_name: '',
          covid: null,
          covid_test_date: '',
          end_date: '',
          start_date: '',
        },
        countries: [...state.countries],
        selectedCountry: '',
      }
    case 'EDIT_TRIP':
      let newState = {
        trips: [...state.trips],
        form: { ...state.form },
        countries: [...state.countries],
        selectedCountry: `flag-${state.selectedCountry}`,
      }
      let newTrip = { ...state.form, id: action.payload.id }
      newState.trips = newState.trips.filter((item) => item.id !== action.payload.id)
      newState.trips.push(newTrip)
      return { ...newState }

    case 'SET_TRIPS':
      return {
        trips: action.payload,
        form: { ...state.form },
        countries: [...state.countries],
        selectedCountry: `flag-${state.selectedCountry}`,
      }
    case 'ADD_TRIP':
      return {
        trips: [...state.trips, action.payload],
        form: { ...state.form },
        countries: [...state.countries],
        selectedCountry: `flag-${state.selectedCountry}`,
      }
    case 'REMOVE_TRIP':
      const filtered = [...state.trips.filter((trip) => trip.id !== action.payload)]
      return {
        trips: filtered,
        form: { ...state.form },
        countries: [...state.countries],
        selectedCountry: `flag-${state.selectedCountry}`,
      }
    case 'SET_COUNTRIES':
      return {
        trips: [...state.trips],
        form: { ...state.form },
        countries: [...action.payload],
        selectedCountry: `flag-${state.selectedCountry}`,
      }
    case 'SET_SELECTED_COUNTRY':
      let tmp0 = {
        trips: [...state.trips],
        form: { ...state.form },
        countries: [...state.countries],
        selectedCountry: `flag-${action.payload}`,
      }
      tmp0.form.address.country = action.payload
      return tmp0
    case 'SET_CompanyName':
      let tmp3 = state
      tmp3.form.company_name = action.payload.company_name
      return {
        ...tmp3,
      }
    case 'SET_Street':
      let tmp5 = state
      tmp5.form.address.street = action.payload.address.street
      return {
        ...tmp5,
      }
    case 'SET_StreetNumber':
      let tmpy = state
      tmpy.form.address.street_num = action.payload.address.street_num
      return {
        ...tmpy,
      }
    case 'SET_ZIP':
      let tmpp = state
      tmpp.form.address.zip = action.payload.address.zip
      return {
        ...tmpp,
      }
    case 'SET_Covid':
      let tmpp1 = state
      tmpp1.form.covid = action.payload.covid
      return { ...tmpp1 }

    case 'SET_CITY':
      let tmp4 = state
      tmp4.form.address.city = action.payload.address.city
      return {
        ...state,
      }
    case 'SET_StartDate':
      let Tmp = state
      Tmp.form.start_date = action.payload.start_date
      return {
        ...Tmp,
      }
    case 'SET_EndDate':
      let Tmp2 = state
      Tmp2.form.end_date = action.payload.end_date
      return {
        ...Tmp2,
      }
    case 'SET_FORM':
      return {
        trips: state.trips,
        form: {
          ...state.form,
          ...action.payload,
          address: {
            ...state.form.address,
            ...action.payload.address,
          },
        },
        countries: state.countries,
        selectedCountry: `flag-${action.payload.address.country}`,
      }
    default:
      throw new Error('Unhandled action')
  }
}

const TripProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchData = async () => {
    const { data } = await api.get('/trip')
    dispatch({ type: 'SET_TRIPS', payload: data })
  }

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [])

  // didnt understand anything of the syntax of this fetchCountries!!
  /*
    Again, It's your code, not mine.

    [Check it out here](https://github.com/TLeobons/sundayfix/blob/4d881807952e9cbf771d16eafe1c6bbc9a416276/src/contexts/TripContext.js#L183)
  */
  const fetchCountries = async () => {
    const { data } = (await api.get('/country')) as {
      data: { label: string }[]
    }
    const sortedData = data.sort((a, b) => (a.label > b.label ? 1 : -1))
    const countriesData: any[] = []
    sortedData.forEach((data: any) => {
      countriesData.push({
        value: data.value,
        label: data.label,
        className: `flag-${data.value}`,
      })
    })
    dispatch({ type: 'SET_COUNTRIES', payload: countriesData })
  }

  return <TripContext.Provider value={[state, dispatch]}>{children}</TripContext.Provider>
}

export default TripProvider
