import Link from "next/link";
import ServerAuthWrapper from "~/components/server_auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatDate } from "~/lib/utils";
import { getContact, getContactsWithTasks } from "~/server/db/query/coreforce";

export default async function TaskManagerPage({
  params: { id },
}: {
  params: { id: string };
}) {
  let contacts;
  let header;

  if (id === "all") {
    contacts = await getContactsWithTasks();
    header = "All Active Email Tasks";
  } else {
    try {
      const contact = await getContact(id);
      if (!contact) throw new Error("Contact not found");

      contacts = [contact];
      header = `Email Task for ${contact.firstName} ${contact.lastName}`;
    } catch {
      contacts = undefined;
      header = "Email Task";
    }
  }

  return (
    <ServerAuthWrapper
      page={() => (
        <div>
          <h1 className="pb-2 text-center text-2xl font-bold">{header}</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Origination Date</TableHead>
                <TableHead>Current Sequence</TableHead>
                <TableHead>{/* Blank */}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!contacts || contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {!contacts ? "Task not found" : "No active tasks found"}
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.lastName ?? "N/A"}</TableCell>
                    <TableCell>{contact.firstName ?? "N/A"}</TableCell>
                    <TableCell>
                      {contact.primaryEmailAddress ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatDate(contact.activeTask?.origination) ??
                        "No Active Task"}
                    </TableCell>
                    <TableCell>
                      {contact.activeTask?.sequence ?? "No Active Task"}
                    </TableCell>
                    <TableCell className="flex flex-row gap-2 align-middle">
                      <Link href={`/touchpoint-manager/${contact.id}`}>
                        View Touchpoints
                      </Link>
                      <Link href={`/view-cart/${contact.id}`}>View Cart</Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    />
  );
}
