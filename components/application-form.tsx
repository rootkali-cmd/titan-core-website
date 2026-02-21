"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  applicationFormSchema,
  contactOptions,
  rankOptions,
  regionOptions,
  roleOptions,
  type ApplicationFormValues,
} from "@/lib/validation";

const RULES_STORAGE_KEY = "titan-core-rules-agreed";

const fieldStyle =
  "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/35";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-300">{message}</p> : null;

export function ApplicationForm() {
  const router = useRouter();
  const [rulesAccepted, setRulesAccepted] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onTouched",
    defaultValues: {
      inGameName: "",
      playerId: "",
      region: "MENA",
      age: 16,
      currentRank: "Diamond",
      kd: 1,
      roles: [],
      availability: "",
      previousExperience: "",
      contactMethod: "WhatsApp",
      whatsappNumber: "",
      telegramUsername: "",
      discord: "",
      notes: "",
    },
  });

  const selectedContact = watch("contactMethod");
  const selectedRoles = watch("roles") ?? [];

  useEffect(() => {
    const accepted = window.localStorage.getItem(RULES_STORAGE_KEY) === "true";
    setRulesAccepted(accepted);
  }, []);

  useEffect(() => {
    if (selectedContact === "WhatsApp") {
      setValue("telegramUsername", "");
    } else {
      setValue("whatsappNumber", "");
    }
  }, [selectedContact, setValue]);

  const toggleRole = (role: (typeof roleOptions)[number]) => {
    const current = selectedRoles ?? [];
    const next = current.includes(role) ? current.filter((item) => item !== role) : [...current, role];
    setValue("roles", next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError("");

    if (!rulesAccepted) {
      setSubmitError("يجب الموافقة على القواعد قبل إرسال الطلب.");
      return;
    }

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        agreedToRules: true,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const fallback = "تعذر إرسال الطلب حاليًا. حاول مرة أخرى.";
      setSubmitError(typeof data?.message === "string" ? data.message : fallback);
      return;
    }

    router.push("/apply/success");
  });

  if (rulesAccepted === null) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/45 px-6 py-4 text-slate-200 backdrop-blur-md">
          <Loader2 className="size-5 animate-spin text-orange-300" />
          <span className="text-sm">جاري تحميل النموذج...</span>
        </div>
      </div>
    );
  }

  if (!rulesAccepted) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-orange-400/35 bg-black/55 p-6 text-center shadow-[0_0_30px_rgba(249,115,22,0.2)] backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold text-white">يجب الموافقة على القواعد أولًا</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            قبل إرسال طلب الانضمام، ادخل صفحة القواعد وفعّل خيار <span className="font-semibold text-orange-300">أوافق على القواعد</span>.
          </p>
          <Link
            href="/rules"
            className="mx-auto mt-6 inline-flex rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            الذهاب إلى صفحة القواعد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl justify-center px-4 pb-10 pt-24 sm:pt-28">
      <div className="w-full rounded-2xl border border-white/15 bg-black/45 p-5 shadow-[0_0_45px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
        <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">نموذج التقديم - Titan Core</h1>
        <p className="mt-2 text-center text-sm text-slate-300">املأ جميع البيانات بدقة لرفع فرصة القبول.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">In-Game Name</label>
              <input className={fieldStyle} placeholder="Your PUBG name" {...register("inGameName")} />
              <FieldError message={errors.inGameName?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Player ID</label>
              <input
                className={fieldStyle}
                inputMode="numeric"
                placeholder="مثال: 5123456789"
                {...register("playerId")}
              />
              <FieldError message={errors.playerId?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Server / Region</label>
              <select className={fieldStyle} {...register("region")}>
                {regionOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#101013]">
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={errors.region?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Age</label>
              <input className={fieldStyle} type="number" min={16} {...register("age", { valueAsNumber: true })} />
              <FieldError message={errors.age?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Current Rank</label>
              <select className={fieldStyle} {...register("currentRank")}>
                {rankOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#101013]">
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={errors.currentRank?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">KD</label>
              <input className={fieldStyle} type="number" step="0.1" min={0} max={50} {...register("kd", { valueAsNumber: true })} />
              <FieldError message={errors.kd?.message} />
            </div>
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-slate-200">Role (يمكن اختيار أكثر من دور)</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {roleOptions.map((role) => {
                const active = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={clsx(
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "border-orange-400 bg-orange-500/20 text-orange-100 shadow-[0_0_18px_rgba(249,115,22,0.35)]"
                        : "border-white/15 bg-black/35 text-slate-200 hover:border-orange-400/70 hover:text-white",
                    )}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.roles?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Availability</label>
            <input className={fieldStyle} placeholder="مثال: يوميًا من 8م إلى 12ص" {...register("availability")} />
            <FieldError message={errors.availability?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Previous Experience</label>
            <textarea
              className={`${fieldStyle} min-h-28 resize-y`}
              placeholder="اذكر البطولات/الفرق السابقة بإيجاز"
              {...register("previousExperience")}
            />
            <FieldError message={errors.previousExperience?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Contact Method</label>
              <select className={fieldStyle} {...register("contactMethod")}>
                {contactOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#101013]">
                    {option}
                  </option>
                ))}
              </select>
              <FieldError message={errors.contactMethod?.message} />
            </div>

            {selectedContact === "WhatsApp" ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">WhatsApp Number</label>
                <input className={fieldStyle} placeholder="+201234567890" {...register("whatsappNumber")} />
                <FieldError message={errors.whatsappNumber?.message} />
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Telegram Username</label>
                <input className={fieldStyle} placeholder="@username" {...register("telegramUsername")} />
                <FieldError message={errors.telegramUsername?.message} />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Discord (اختياري)</label>
              <input className={fieldStyle} placeholder="username#0000" {...register("discord")} />
              <FieldError message={errors.discord?.message} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">Notes (اختياري)</label>
              <input className={fieldStyle} placeholder="أي ملاحظات إضافية" {...register("notes")} />
              <FieldError message={errors.notes?.message} />
            </div>
          </div>

          {submitError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{submitError}</div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="button-glow mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              "إرسال طلب الانضمام"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
