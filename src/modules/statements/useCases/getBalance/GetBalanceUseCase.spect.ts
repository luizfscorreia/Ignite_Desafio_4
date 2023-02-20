import { InMemoryStatementsRepository } from "modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "modules/users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let userRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

let statementRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

describe("Get Balance", () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)

    statementRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository)

    getBalanceUseCase = new GetBalanceUseCase(statementRepository, userRepository)
  })

  it("Should be able to get a user balance", async () => {
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

    const balance = await getBalanceUseCase.execute({user_id: user.id})

    expect(balance).toHaveProperty("id")
  })

  it("Should not be able to get the balance of a non existent user", () => {
    expect(async ()=>{
      await getBalanceUseCase.execute({user_id: "fake_id"})
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
