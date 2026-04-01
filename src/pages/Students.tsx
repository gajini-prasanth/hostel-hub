import { useState } from "react";
import { students } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const feeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  paid: "secondary",
  pending: "default",
  overdue: "destructive",
};

export default function Students() {
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const courses = [...new Set(students.map((s) => s.course))];
  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === "all" || s.course === filterCourse;
    return matchSearch && matchCourse;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-description">Manage hostel students</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div><Label>Full Name</Label><Input placeholder="Enter name" className="mt-1" /></div>
              <div><Label>Student ID</Label><Input placeholder="e.g. S009" className="mt-1" /></div>
              <div><Label>Email</Label><Input type="email" placeholder="Email" className="mt-1" /></div>
              <div><Label>Phone</Label><Input placeholder="Phone number" className="mt-1" /></div>
              <div><Label>Course</Label><Input placeholder="e.g. B.Tech CS" className="mt-1" /></div>
              <div><Label>Year</Label><Input type="number" placeholder="Year" className="mt-1" /></div>
              <div><Label>Parent Name</Label><Input placeholder="Parent name" className="mt-1" /></div>
              <div><Label>Parent Phone</Label><Input placeholder="Parent phone" className="mt-1" /></div>
              <div className="col-span-2"><Label>Room Number</Label><Input placeholder="e.g. 101" className="mt-1" /></div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Student</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden sm:table-cell">Room</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{s.course}</TableCell>
                  <TableCell className="hidden sm:table-cell">{s.roomNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{s.phone}</TableCell>
                  <TableCell>
                    <Badge variant={feeVariant[s.feeStatus]}>{s.feeStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
