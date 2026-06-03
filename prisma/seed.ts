import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  const adminPassword = await hashPassword("admin123");
  const teacherPassword = await hashPassword("guru123");
  const studentPassword = await hashPassword("siswa123");

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { username: "guru001" },
    update: {},
    create: {
      username: "guru001",
      password: teacherPassword,
      role: "TEACHER",
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { username: "20240001" },
    update: {},
    create: {
      username: "20240001",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { teacherCode: "G001" },
    update: {},
    create: {
      userId: teacherUser.id,
      teacherCode: "G001",
      name: "Guru Matematika",
    },
  });

  const student = await prisma.student.upsert({
    where: { nis: "20240001" },
    update: {},
    create: {
      userId: studentUser.id,
      nis: "20240001",
      name: "Siswa Demo",
    },
  });

  const classRoom = await prisma.classRoom.upsert({
    where: { name: "X RPL 1" },
    update: {},
    create: {
      name: "X RPL 1",
      level: "X",
    },
  });

  const mathematics = await prisma.subject.upsert({
    where: { code: "MTK" },
    update: {},
    create: {
      code: "MTK",
      name: "Matematika",
    },
  });

  await prisma.subject.upsert({
    where: { code: "BIN" },
    update: {},
    create: {
      code: "BIN",
      name: "Bahasa Indonesia",
    },
  });

  await prisma.subject.upsert({
    where: { code: "BIG" },
    update: {},
    create: {
      code: "BIG",
      name: "Bahasa Inggris",
    },
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { name: "2025/2026" },
    update: { isActive: true },
    create: {
      name: "2025/2026",
      isActive: true,
    },
  });

  const teacherSubject = await prisma.teacherSubject.upsert({
    where: {
      teacherId_subjectId: {
        teacherId: teacher.id,
        subjectId: mathematics.id,
      },
    },
    update: {},
    create: {
      teacherId: teacher.id,
      subjectId: mathematics.id,
    },
  });

  const enrollment = await prisma.studentClassEnrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: student.id,
        academicYearId: academicYear.id,
      },
    },
    update: {
      classRoomId: classRoom.id,
    },
    create: {
      studentId: student.id,
      classRoomId: classRoom.id,
      academicYearId: academicYear.id,
    },
  });

  await prisma.score.upsert({
    where: {
      enrollmentId_teacherSubjectId: {
        enrollmentId: enrollment.id,
        teacherSubjectId: teacherSubject.id,
      },
    },
    update: {},
    create: {
      enrollmentId: enrollment.id,
      teacherSubjectId: teacherSubject.id,
      taskScore: 80,
      utsScore: 75,
      uasScore: 85,
      finalScore: 81.5,
      status: "PASSED",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
