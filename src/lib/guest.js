// Swipes made before creating an account live here, then get imported on sign-up.
const KEY = 'br_guest_swipes';

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — guest swipes stay in memory for this visit */
  }
}

export const guestSwipes = {
  all: read,
  likes: () => read().filter((s) => s.swipeDirection === 'right'),
  add(dish, swipeDirection) {
    const list = read().filter((s) => s.dishId !== dish.id);
    list.push({ dishId: dish.id, swipeDirection, dish });
    write(list);
  },
  remove(dishId) {
    write(read().filter((s) => s.dishId !== dishId));
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};
