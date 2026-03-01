import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Search, Trash } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeads,
  createLead,
  deleteLead,
  LeadPayload,
} from "@/services/api";

interface Lead extends LeadPayload {
  id: number;
}

const statusVariant: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-warning/10 text-warning border-warning/20",
  Cold: "bg-info/10 text-info border-info/20",
};

const Leads = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<LeadPayload>({
    name: "",
    company: "",
    role: "",
    email: "",
    industry: "",
    status: "Warm",
    notes: "",
  });

  // GET
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setShowForm(false);
      setForm({
        name: "",
        company: "",
        role: "",
        email: "",
        industry: "",
        status: "Warm",
        notes: "",
      });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your leads pipeline.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {["name", "company", "role", "email", "industry"].map((f) => (
              <div key={f}>
                <Label>{f}</Label>
                <Input
                  value={(form as any)[f]}
                  onChange={(e) =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                />
              </div>
            ))}

            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot">Hot</SelectItem>
                  <SelectItem value="Warm">Warm</SelectItem>
                  <SelectItem value="Cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 md:col-span-3">
              <Button onClick={() => createMutation.mutate(form)}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.role}</TableCell>
                    <TableCell>{lead.industry}</TableCell>
                    <TableCell>
                      <Badge className={statusVariant[lead.status]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => deleteMutation.mutate(lead.id)}
                        className="p-1 hover:bg-secondary rounded"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;