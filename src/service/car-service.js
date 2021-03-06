import CreateCar from '../apollo/mutations/CreateCar'
import UpdateCar from '../apollo/mutations/UpdateCar'
import DeleteCar from '../apollo/mutations/DeleteCar'
import ListCars from '../apollo/queries/ListCars'
import GetCar from '../apollo/queries/GetCar'
import { apolloClient } from '../apollo'
import userService from '../service/user-service'

export default {

  async createCar(car) {
    apolloClient.mutate({
      mutation: CreateCar,
      variables: {
        createcarinput: car
      },
      update(cache, { data: createCar }) {
        const data = cache.readQuery({ query: ListCars })

        // somehow this method is called 3 times.
        // 1x for optimisticResponse, 2x for actual response.
        const isDuplicated = data.listCars.items.map(car => car.id).some(id => createCar.createCar.id === id)
        if (isDuplicated) {
          return
        }

        if (createCar.createCar.id.startsWith('optimistic')) {
          // add optimistic response to data
          data.listCars.items = [...data.listCars.items, createCar.createCar]
        } else {
          // replace with optimistic response with actual response
          data.listCars.items = data.listCars.items.filter(car => !car.id.startsWith('optimistic'))
          data.listCars.items = [...data.listCars.items, createCar.createCar]
        }
        cache.writeQuery({ query: ListCars, data })
      },
      optimisticResponse: {
        __typename: "Mutation",
        createCar: {
          id: 'optimistic' + new Date().getTime(),
          __typename: "Car",
          ownerUsername: userService.getUsername(),
          ownerName: userService.getName(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...car
        }
      }
    })
  },

  async updateCar(car) {
    // remove fields which are not part of the schema. (_type)
    // otherwise apollo will refuse the update
    Object.keys(car)
      .filter(attr => attr.startsWith('__typename'))
      .forEach(attr => delete car[attr])

    apolloClient.mutate({
      mutation: UpdateCar,
      variables: {
        updatecarinput: car
      },
      update(cache, { data: updateCar }) {
        const data = cache.readQuery({ query: ListCars })
        data.listCars.items = data.listCars.items.filter(car => car.id !== updateCar.updateCar.id)
        data.listCars.items = [...data.listCars.items, updateCar.updateCar]
        cache.writeQuery({ query: ListCars, data })
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateCar: {
          __typename: "Car",
          ownerUsername: userService.getUsername(),
          ownerName: userService.getName(),
          updatedAt: new Date().toISOString(),
          ...car
        }
      }
    })
  },

  async deleteCar(car) {
    apolloClient.mutate({
      mutation: DeleteCar,
      variables: { id: car.id },
      update(cache, { data: deleteCar }) {
        const data = cache.readQuery({ query: ListCars })
        data.listCars.items = data.listCars.items.filter(car => car.id !== deleteCar.deleteCar.id)
        cache.writeQuery({ query: ListCars, data })
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteCar: {
          id: car.id,
          __typename: "Car"
        }
      }
    })
  },

  async getCar(carId) {
    if (!carId) {
      throw new Error('carId not provided')
    }
    return apolloClient.query({
      query: GetCar,
      variables: { id: carId },
      prefetch: true
    }).then(data => {
      if (data.data && data.data.getCar) {
        return data.data.getCar
      } else {
        throw new Error('car with carId not found')
      }
    })
  }
}

