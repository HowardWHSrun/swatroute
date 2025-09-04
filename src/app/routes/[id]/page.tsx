import { prisma } from "@/lib/prisma";
import { Container, Typography, Box, Divider } from "@mui/material";
import ClientMap from "@/components/ClientMap";
import HexagonRadar from "@/components/HexagonRadar";

export default async function RouteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = await prisma.route.findUnique({ where: { id } });
  if (!route) return <div>Not found</div>;
  const poly = JSON.parse(route.polyline) as [number, number][];
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {route.title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        by {route.author}
      </Typography>
      <ClientMap polyline={poly} height={420} />
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <HexagonRadar
          ratings={{
            traffic: route.traffic,
            elevation: route.elevation,
            scenic: route.scenic,
            surface: route.surface,
            safety: route.safety,
            access: route.access,
          }}
          size={300}
        />
      </Box>
    </Container>
  );
}


