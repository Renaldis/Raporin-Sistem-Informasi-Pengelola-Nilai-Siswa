import { ClassRoomDeleteDialog } from "@/app/dashboard/admin/classes/_components/class-room-delete-dialog";
import { ClassRoomFormDialog } from "@/app/dashboard/admin/classes/_components/class-room-form-dialog";
import { DataTable } from "@/components/data-table";

export type ClassRoomRow = {
  id: string;
  name: string;
  level: string;
  createdAt: Date;
};

type ClassRoomsTableProps = {
  classRooms: ClassRoomRow[];
};

export function ClassRoomsTable({ classRooms }: ClassRoomsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "name",
          header: "Nama Kelas",
          cell: (classRoom) => (
            <span className="font-medium">{classRoom.name}</span>
          ),
        },
        {
          key: "level",
          header: "Level",
          cell: (classRoom) => classRoom.level,
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (classRoom) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(classRoom.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (classRoom) => (
            <div className="flex flex-wrap gap-2">
              <ClassRoomFormDialog mode="update" classRoom={classRoom} />
              <ClassRoomDeleteDialog classRoom={classRoom} />
            </div>
          ),
        },
      ]}
      data={classRooms}
      emptyDescription="Tambahkan kelas pertama untuk mulai menempatkan siswa."
      emptyTitle="Belum ada data kelas"
      getRowKey={(classRoom) => classRoom.id}
    />
  );
}
