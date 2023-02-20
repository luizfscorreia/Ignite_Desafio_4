import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("Should be able to create a new user", async() => {
    const user = await createUserUseCase.execute({
      name: "Luiz",
      email: "luiz@gmail.com",
      password: "123456"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to register a already registered user", async () => {

    await createUserUseCase.execute({
      name: "Luiz",
      email: "luiz@gmail.com",
      password: "123456"
    })

    await expect(
      createUserUseCase.execute({
        name: "Luiz",
        email: "luiz@gmail.com",
        password: "123456"
      })
    ).rejects.toEqual(new CreateUserError())
  })


})
