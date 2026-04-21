import { IClientsEntity } from "@/product-types";

/**
 * Filters clients by matching the search term against
 * first_name, last_name, full name (first + last), national_id, phone_number, and email.
 * Case-insensitive matching.
 */
export function filterClients(
  clients: (IClientsEntity & { id?: string })[],
  searchTerm: string
): (IClientsEntity & { id?: string })[] {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return clients;

  return clients.filter((client) => {
    const firstName = (client.first_name || "").toLowerCase();
    const lastName = (client.last_name || "").toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const nationalId = (client.national_id || "").toLowerCase();
    const phone = (client.phone_number || "").toLowerCase();
    const email = (client.email || "").toLowerCase();

    return (
      firstName.includes(trimmed) ||
      lastName.includes(trimmed) ||
      fullName.includes(trimmed) ||
      nationalId.includes(trimmed) ||
      phone.includes(trimmed) ||
      email.includes(trimmed)
    );
  });
}