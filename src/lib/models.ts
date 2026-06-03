export class StudentModel {
  constructor(
    public id: string,
    public nis: string,
    public name: string
  ) {}

  getProfile(): string {
    return `${this.name} - ${this.nis}`;
  }
}

export class ScoreModel {
  constructor(
    public classRoomName: string,
    public subjectName: string,
    public academicYearName: string,
    public teacherName: string,
    public taskScore: number,
    public utsScore: number,
    public uasScore: number
  ) {}

  calculateFinalScore(): number {
    return this.taskScore * 0.3 + this.utsScore * 0.3 + this.uasScore * 0.4;
  }

  getGraduationStatus(): "LULUS" | "TIDAK LULUS" {
    return this.calculateFinalScore() >= 70 ? "LULUS" : "TIDAK LULUS";
  }

  getScoreSummary(): string {
    return `${this.classRoomName} - ${this.subjectName} - ${this.academicYearName} - ${this.teacherName} - ${this.calculateFinalScore()}`;
  }
}
