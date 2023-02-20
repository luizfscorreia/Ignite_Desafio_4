import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let userRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

let statementRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get Statement Operation", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)

    statementRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository)

    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementRepository)
  })

  it("Should be able to get a statement operation", async () => {
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

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })

    expect(operation).toHaveProperty("id")
  })

  it("Should not be able to get a statement operation of a non existent user", () => {
    expect(async () => {
      const operation = await getStatementOperationUseCase.execute({
        user_id: "fake_user_id",
        statement_id: "fake_statement_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to get a non existent statement", () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "Luiz",
        email: "luiz@gmail.com",
        password: "123456"
      })

      const operation = await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "fake_statement_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})
