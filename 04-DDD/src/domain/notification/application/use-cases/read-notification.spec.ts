import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { ReadNotificationUseCase } from "./read-notification"
import { makeNotification } from "test/factories/make-notification"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase
// sut : System Under Test

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {

    const notification = makeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString()
    })


    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
        const newNotification = makeNotification(
        {
            recipientId: new UniqueEntityID('author-1'),
        },
        new UniqueEntityID('notification-1'),
        )

        inMemoryNotificationsRepository.create(newNotification)


        const result = await sut.execute({
        notificationId: 'notification-1',
        recipientId: 'author-2',
        })


        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
