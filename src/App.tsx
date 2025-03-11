
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategorySelection from "./pages/CategorySelection";
import GameModeSelection from "./pages/GameModeSelection";
import Game from "./pages/Game";
import WinScreen from "./pages/WinScreen";
import GameOver from "./pages/GameOver";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<CategorySelection />} />
          <Route path="/gamemode/:categoryId" element={<GameModeSelection />} />
          <Route path="/game/:categoryId/:mode" element={<Game />} />
          <Route path="/win/:categoryId/:mode/:time" element={<WinScreen />} />
          <Route path="/gameover/:categoryId/:wordsGuessed" element={<GameOver />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
