const returnUser = (user) => {
  if (!user) return null;

   const firstName =
    user?.name?.first?.trim() ||
    user?.userName?.trim() ||
    "User";

  return {
    _id: user._id, 
    name: {
      first: firstName,
      last: user?.name?.last || "",
    },
    email: user.email || "",
    image: {
      url: user?.image?.url ?? undefined,
      alt: user?.image?.alt ?? undefined,
    },
    country: user?.country || "",
    city: user?.city || ""
  };
};

module.exports = returnUser;
