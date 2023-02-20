import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it("Should be able to authenticate an user", async () => {
    await createUserUseCase.execute({
      name: "Luiz",
      email: "luiz@gmail.com",
      password: "123456"
    })

    const auth = await authenticateUserUseCase.execute({
      email: "luiz@gmail.com",
      password: "123456"
    })

    expect(auth).toHaveProperty("token")
  })

  it("Should not be able to authentica a non existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "jose@gmail.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Pedro",
        email: "pedro@gmail.com",
        password: "correct"
      })

      await authenticateUserUseCase.execute({
        email: "pedro@gmail.com",
        password: "incorrect"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
