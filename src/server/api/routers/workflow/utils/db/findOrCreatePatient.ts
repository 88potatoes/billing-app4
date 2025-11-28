import { patients, type Patient } from "~/server/db/schema";

export const findOrCreatePatient = async (
  db: any,
  specifiedId: string,
  googleSheetId: string,
): Promise<Patient> => {
  const patient = await db.query.patients.findFirst({
    where: eq(patients.specifiedId, specifiedId),
  });

  if (!patient) {
    await db.insert(patients).values({
      specifiedId,
      googleSheetId,
    });
  }

  return patient;
};
