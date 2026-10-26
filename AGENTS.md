<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Admin access is gated by `public.user_roles` (role `admin`) checked via `has_role()` in RLS; the first account to sign up becomes admin automatically (trigger on auth.users). Why: prevents any self-registered user from reading leads.
- Pricing/plan rules live in `src/lib/pricing.ts` with tests in `src/lib/pricing.test.ts`. Why: single source for simulator and admin lead values.
- On the public site, inline click/tap-controlled explanations are used instead of hover-only tooltips. Why: Radix tooltips do not open on touch taps, so hover-only help is unreachable on phones.
