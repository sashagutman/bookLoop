import type { FunctionComponent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/my-books/book-details.css";

import type { User } from "../interfaces/users/User";
import { getMe, getUserById } from "../services/userService";
import Loading from "../components/Loading";
import { RiEdit2Line } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import DeleteProfileButton from "../components/my-library/DeleteProfileButton";
import EditProfileModal from "../components/my-library/EditProfileModal";

function safeLocaleDate(v?: string | number | Date) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

const UserDetailsPage: FunctionComponent = () => {
  const { id: routeId } = useParams<{ id?: string }>();
  const { user: authUser, isAdmin } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const isSelf =
    !routeId || routeId === "me" || (!!authUser?._id && routeId === authUser._id);

  const resourceId = routeId ?? "me";
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    function normalize(payload: unknown): User | null {
      if (!payload || typeof payload !== "object") return null;
      if ("user" in (payload as any)) return ((payload as any).user ?? null) as User | null;
      return payload as User;
    }

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = isSelf ? await getMe() : await getUserById(resourceId);
        const data = isSelf ? normalize(res) : normalize((res as any)?.data);
        if (!ignore) setUser(data);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401 && !isSelf) {
          try {
            const meRes = await getMe();
            const meData = normalize(meRes as unknown);
            if (!ignore) setUser(meData);
          } catch (e2: any) {
            if (e2?.response?.status === 401) {
              navigate("/login", { replace: true });
              return;
            }
            if (!ignore) {
              setError("load-failed");
              setUser(null);
            }
          }
        } else if (status === 401 && isSelf) {
          navigate("/login", { replace: true });
          return;
        } else {
          if (!ignore) {
            setError("load-failed");
            setUser(null);
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [isSelf, resourceId, navigate]);

  const userId: string = user?._id ?? "";

  const fullName = useMemo(() => {
    const first = user?.name?.first ?? "";
    const middle = user?.name?.middle ?? "";
    const last = user?.name?.last ?? "";
    const name = [first, middle, last].filter(Boolean).join(" ").trim();
    return name || "User";
  }, [user?.name?.first, user?.name?.middle, user?.name?.last]);

  const canEdit = useMemo(() => {
    if (!authUser?._id) return false;
    return isAdmin || authUser._id === userId;
  }, [authUser?._id, userId, isAdmin]);

  // админ не может удалять самого себя не показываю кнопку
  const canDelete = useMemo(() => !(isAdmin && isSelf), [isAdmin, isSelf]);

  if (isLoading || !!error || !user) {
    return (
      <section className="details-section section-bg">
        <div className="container">
          <Loading />
        </div>
      </section>
    );
  }

  const avatarAlt =
    user.image?.alt ||
    [user.name?.first, user.name?.last].filter(Boolean).join(" ").trim() ||
    "User avatar";

  const createdAt = safeLocaleDate(user.createdAt);
  const updatedAt = safeLocaleDate(user.updatedAt);

  return (
    <section className="details-section">
      <div className="container">
        <h1 className="details-title title-h">{fullName}</h1>

        <div className="details-inner">
          <div className="details-cover">
            <img src={user.image?.url} alt={avatarAlt} loading="lazy" />
          </div>
          <div className="details-info">
            <div className="details-meta">
              <span className="details-genre">{user.isAdmin ? "Admin" : "User"}</span>
              {user.email && <span className="details-year">{user.email}</span>}
            </div>

            {(user.city || user.country) && (
              <p className="details-description text-p">
                <strong>Location:</strong> {[user.city, user.country].filter(Boolean).join(", ")}
              </p>
            )}

            {createdAt && (
              <p className="details-language text-p">
                <strong>Created:</strong> {createdAt}
              </p>
            )}
            {updatedAt && (
              <p className="details-language text-p">
                <strong>Updated:</strong> {updatedAt}
              </p>
            )}
            <p className="details-language text-p">
              <strong>ID:</strong> {userId}
            </p>
          </div>
        </div>

        <div className="details-actions">
          <button
            className="btn-flip"
            onClick={() => canEdit && setShowEdit(true)}
            disabled={!canEdit}
            title={canEdit ? "Edit profile" : "You do not have permission to edit"}
          >
            <span className="front">Edit Profile</span>
            <span className="back">
              <RiEdit2Line />
            </span>
          </button>

          {canDelete && (
            <DeleteProfileButton
              userId={userId}
              fullName={fullName}
              isMeRoute={isSelf}
              disabled={!canEdit}
              titleWhenDisabled="You do not have permission to delete"
            />
          )}
        </div>
      </div>

      {showEdit && user && (
        <EditProfileModal open={showEdit} onClose={() => setShowEdit(false)} user={user} onUpdated={setUser} />
      )}
    </section>
  );
};

export default UserDetailsPage;

