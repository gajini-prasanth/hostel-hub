import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Rooms from "@/pages/Rooms";
import Attendance from "@/pages/Attendance";
import Fees from "@/pages/Fees";
import Complaints from "@/pages/Complaints";
import Notices from "@/pages/Notices";
import Mess from "@/pages/Mess";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/mess" element={<Mess />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
