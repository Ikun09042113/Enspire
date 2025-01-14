import { Days, Periods, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId)
    setResponseStatus(event, 403)

  // TODO: admin auth
  const records = await prisma.reservationRecord.findMany({
    include: {
      user: true,
      classroom: true,
      club: true,
    },
  })
  return JSON.stringify({
    days: Days,
    periods: Periods,
    data: Array.from(records.values()),
  })
})
