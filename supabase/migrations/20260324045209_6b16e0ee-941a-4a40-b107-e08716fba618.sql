
CREATE POLICY "Admins can view webhook events" ON public.webhook_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
