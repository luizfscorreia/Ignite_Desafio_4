import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let userRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("User Profile", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository)
  })

  it("Should be able to show user profile", async () => {
    const user = await userRepository.create({
      name: "Luiz",
      email: "luiz@gmail.com",
      password: "123"
    })

    const profile = await showUserProfileUseCase.execute(user.id)

    expect(profile).toHaveProperty("id")
  })

  it("Should not be able to show a non existent user profile", () => {
    expect(async ()=> {
      await showUserProfileUseCase.execute('fakeid')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
