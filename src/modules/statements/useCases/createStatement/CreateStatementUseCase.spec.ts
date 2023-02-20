import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from './CreateStatementUseCase'
import { ICreateStatementDTO } from "./ICreateStatementDTO"

let userRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create Statement", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)
    createStatementRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepository, createStatementRepository)
  })

  it("Should be able to create a statement", async() => {
    const user = await createUserUseCase.execute({
      name: "Luiz",
      email: "luiz@gmail.com",
      password: "123456"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 10,
      description: "Deposit Statement",
      type: "deposit",
    } as ICreateStatementDTO)

    expect(statement).toHaveProperty("id")
  })

  it("Should not be able to create a statement of a non existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalid_id",
        amount: 10,
        description: "Deposit Statement",
        type: "deposit",
      } as ICreateStatementDTO)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should not be able to create a statement of users that dont have enough funds", async () => {
    expect(async ()=>{
      const user = await createUserUseCase.execute({
        name: "Luiz",
        email: "luiz@gmail.com",
        password: "123456"
      })

      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 100,
        description: "Deposit Statement",
        type: "withdraw",
      } as ICreateStatementDTO)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
