import { useState } from 'react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { PasswordField } from '../components/PasswordField';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { useReportOptions } from '../hooks/useReportOptions';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { getApiErrorMessage } from '../utils/apiError';
import { isStrongPassword } from '../utils/passwordStrength';

export function SettingsPage() {
  const { user, logout, refreshMe } = useAuth();
  const { categories, categoryTree, addCategory, addSubcategory, removeCategory, removeSubcategory } = useReportOptions();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [subcategoryDrafts, setSubcategoryDrafts] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);

  useEffect(() => {
    setFullName(user?.full_name || '');
  }, [user?.full_name]);

  const onUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setProfileError('Full name is required.');
      return;
    }

    setProfileSaving(true);
    try {
      const response = await api.patch('/auth/me', { full_name: trimmedName });
      setProfileSuccess('Profile updated successfully.');
      setFullName(response.data.full_name);
      await refreshMe();
    } catch (err: unknown) {
      setProfileError(getApiErrorMessage(err, 'Unable to update profile.'));
    } finally {
      setProfileSaving(false);
    }
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordError('Please meet all password strength requirements.');
      return;
    }

    setPasswordSaving(true);
    try {
      const response = await api.post<{ message: string }>('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(response.data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPasswordError(getApiErrorMessage(err, 'Unable to change password.'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const togglePasswordPanel = () => {
    setShowPasswordPanel((prev) => !prev);
    setPasswordError('');
    setPasswordSuccess('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const onAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    addCategory(newCategory);
    setNewCategory('');
  };

  const onAddSubcategory = (category: string, e: FormEvent) => {
    e.preventDefault();
    const value = (subcategoryDrafts[category] || '').trim();
    if (!value) return;
    addSubcategory(category, value);
    setSubcategoryDrafts((prev) => ({ ...prev, [category]: '' }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-gradient-to-r from-violet-950 via-violet-900 to-fuchsia-900 px-6 py-5 text-white shadow-2xl md:px-7 md:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Settings workspace</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Profile, security, and report structure</h2>
            <p className="mt-2 max-w-2xl text-sm text-violet-100/85">
              Control account access, update your password, and manage the category system used across reports.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur md:p-7">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">Profile & Security</h3>
        <p className="mt-1 text-sm text-slate-600">Manage your account details and security settings.</p>
        <form onSubmit={onUpdateProfile} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full Name
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                placeholder="Enter your full name"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Username</span>
                <span className="mt-1 block">{user?.username}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</span>
                <span className="mt-1 block">{user?.role}</span>
              </div>
            </div>
          </div>

          {profileError && <p className="mt-3 text-sm text-rose-700">{profileError}</p>}
          {profileSuccess && <p className="mt-3 text-sm text-emerald-700">{profileSuccess}</p>}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600 disabled:opacity-60"
            >
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={togglePasswordPanel}
          className="mt-6 w-full rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600 md:w-auto"
        >
          {showPasswordPanel ? 'Cancel Password Change' : 'Change Password'}
        </button>
      </section>

      {showPasswordPanel && (
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur md:p-7">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Change Password</h3>
          <p className="mt-1 text-sm text-slate-600">Use a strong password and keep your account secure.</p>

          <form onSubmit={onChangePassword} className="mt-5 space-y-3">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
              minLength={8}
            />

            <div>
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                required
                minLength={8}
              />
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              minLength={8}
            />

            {passwordError && <p className="text-sm text-rose-700">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-emerald-700">{passwordSuccess}</p>}

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full rounded-xl bg-violet-700 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-violet-600 disabled:opacity-60"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Categories</h3>
              <p className="mt-1 text-sm text-slate-600">Manage the primary report categories used in the reports module.</p>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{categories.length} items</span>
          </div>

          <form onSubmit={onAddCategory} className="mt-4 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add category"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
            <button type="submit" className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">
              Add
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <span>{category}</span>
                <button type="button" onClick={() => removeCategory(category)} className="text-xs font-semibold text-rose-600">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Subcategories by category</h3>
          <p className="mt-1 text-sm text-slate-600">Add subcategories under each main category. Nothing is shown as a separate top-level subcategory list.</p>

          <div className="mt-5 space-y-4">
            {categories.map((category) => {
              const subcategoryValue = subcategoryDrafts[category] || '';
              const subcategories = categoryTree[category] || [];

              return (
                <div key={category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-500">Main category</p>
                      <h4 className="text-lg font-semibold text-slate-900">{category}</h4>
                    </div>
                    <button type="button" onClick={() => removeCategory(category)} className="text-xs font-semibold text-rose-600">
                      Remove category
                    </button>
                  </div>

                  <form onSubmit={(e) => onAddSubcategory(category, e)} className="mt-4 flex gap-2">
                    <input
                      value={subcategoryValue}
                      onChange={(e) =>
                        setSubcategoryDrafts((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      placeholder={`Add subcategory under ${category}`}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                    />
                    <button type="submit" className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">
                      Add
                    </button>
                  </form>

                  <div className="mt-3 max-h-36 overflow-y-auto rounded-2xl border border-violet-100 bg-gradient-to-b from-white to-slate-50 p-2 shadow-inner">
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((subcategory) => (
                        <div key={subcategory} className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                          <span>{subcategory}</span>
                          <button type="button" onClick={() => removeSubcategory(category, subcategory)} className="text-xs font-semibold text-rose-600">
                            Remove
                          </button>
                        </div>
                      ))}
                      {!subcategories.length && <p className="text-sm text-slate-500">No subcategories added yet.</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
