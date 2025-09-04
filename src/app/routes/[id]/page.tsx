import { prisma } from "@/lib/prisma";
import { Container, Typography, Box, Divider, Button } from "@mui/material";
import ClientMap from "@/components/ClientMap";
import HexagonRadar from "@/components/HexagonRadar";
import CommentsSection from "@/components/CommentsSection";

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
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button href={`/api/routes/${route.id}/download`} variant="outlined" size="small">
          Download GPX
        </Button>
      </Box>
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
      <CommentsSection routeId={route.id} />
    </Container>
  );
}


