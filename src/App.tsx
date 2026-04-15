import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SobreNos from "./pages/SobreNos.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import ClientLogin from "./pages/ClientLogin.tsx";
import ClientProfile from "./pages/ClientProfile.tsx";
import ClientSettings from "./pages/ClientSettings.tsx";
import ClientBookings from "./pages/ClientBookings.tsx";
import { AuthProvider } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/servico/:id" element={<ServiceDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<ClientLogin />} />
          <Route path="/area-cliente" element={<ClientProfile />} />
          <Route path="/perfil/dados" element={<ClientSettings />} />
          <Route path="/perfil/reservas" element={<ClientBookings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
