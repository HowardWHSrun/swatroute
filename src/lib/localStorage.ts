// Client-side storage fallback for GitHub Pages (no backend)
export type StoredRoute = {
  id: string;
  createdAt: string;
  title: string;
  author: string;
  gpxText: string;
  polyline: string; // JSON
  traffic: number;
  elevation: number;
  scenic: number;
  surface: number;
  safety: number;
  access: number;
};

export type StoredComment = {
  id: string;
  createdAt: string;
  author: string;
  body: string;
  routeId: string;
};

const ROUTES_KEY = 'swat-routes';
const COMMENTS_KEY = 'swat-comments';

export function getStoredRoutes(): StoredRoute[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(ROUTES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveRoute(route: Omit<StoredRoute, 'id' | 'createdAt'>): StoredRoute {
  const newRoute: StoredRoute = {
    ...route,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  const routes = getStoredRoutes();
  routes.unshift(newRoute);
  localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
  return newRoute;
}

export function getStoredComments(routeId: string): StoredComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const all: StoredComment[] = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    return all.filter(c => c.routeId === routeId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveComment(comment: Omit<StoredComment, 'id' | 'createdAt'>): StoredComment {
  const newComment: StoredComment = {
    ...comment,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  comments.unshift(newComment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  return newComment;
}
