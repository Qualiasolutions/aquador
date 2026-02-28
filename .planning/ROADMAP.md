# Roadmap: Critical Security Vulnerabilities Milestone

## Project Timeline: 4 Parallel Phases
**Approach**: Aggressive security overhaul - attack critical issues simultaneously
**Scope**: Eliminate all CRITICAL and HIGH priority vulnerabilities immediately

---

## Phase 4: Admin API Security (CRITICAL - Start Immediately)
**Goal**: Eliminate unprotected admin API routes

### Tasks
1. **Fix `/api/admin/orders` Auth Bypass**
   - File: `src/app/api/admin/orders/route.ts`
   - Add direct auth check in route handler (middleware doesn't cover `/api/admin/*`)
   - Check user exists in `admin_users` table
   - Return proper 401/403 responses

2. **Audit All Admin Routes**
   - Scan for any other `/api/admin/*` routes
   - Verify middleware pattern covers actual routes
   - Add auth checks to any unprotected admin endpoints

3. **Test Auth Bypass Prevention**
   - Manual testing of unauthorized access
   - Unit tests for auth failure scenarios
   - Verify admin table membership checking

### Exit Criteria
- Zero unprotected admin API routes
- 401/403 responses for unauthorized requests
- Test coverage for auth bypass scenarios

### **Duration**: 1-2 hours (URGENT)

---

## Phase 5: RLS Verification & Implementation (CRITICAL - Start in Parallel)
**Goal**: Ensure all database tables have proper Row Level Security

### Tasks
1. **Export Current Database Schema**
   - Export full schema from Supabase dashboard
   - Commit schema to version control for audit trail
   - Document current RLS status per table

2. **Verify RLS on All Tables**
   - Check `products`, `orders`, `customers`, `admin_users`, `blog_posts`
   - Identify tables missing RLS policies
   - Document risk level per missing policy

3. **Implement Missing RLS Policies**
   - Create appropriate policies for each table
   - Test policies don't break existing functionality
   - Verify unauthorized access is blocked

4. **RLS Policy Documentation**
   - Document all policies created
   - Include policy rationale and access patterns
   - Create RLS testing checklist

### Exit Criteria
- All tables have RLS enabled with appropriate policies
- Database schema documented in version control
- RLS tested with different user roles
- No unauthorized data access possible

### **Duration**: 2-3 hours

---

## Phase 6: Bundle Optimization (HIGH - Start After Security)
**Goal**: Remove 9,067-line static products catalog

### Tasks
1. **Analyze Static Product Usage**
   - Map all imports of `src/lib/products.ts`
   - Identify which functions are actually used
   - Plan migration path to Supabase queries

2. **Migrate Product Listing Pages**
   - Update shop pages to use `product-service.ts`
   - Replace static product data with database queries
   - Ensure pagination and filtering work

3. **Update AI Assistant Catalog**
   - Migrate `src/lib/ai/catalogue-data.ts` to use Supabase
   - Update AI product recommendations to query database
   - Test AI assistant with live data

4. **Remove Static Products File**
   - Delete `src/lib/products.ts` completely
   - Update all imports to use Supabase service
   - Verify no broken imports remain

5. **Performance Testing**
   - Measure bundle size reduction
   - Test page load performance
   - Ensure database queries are fast enough

### Exit Criteria
- `src/lib/products.ts` file completely removed
- Bundle size reduced by 200-400KB
- All functionality preserved
- Performance maintained or improved

### **Duration**: 3-4 hours

---

## Phase 7: Comprehensive Input Validation (MEDIUM - Final Phase)
**Goal**: Add Zod validation to all API routes

### Tasks
1. **Create Zod Schemas for Critical Routes**
   - `/api/checkout` - cart items, customer data validation
   - `/api/create-perfume/payment` - perfume composition validation
   - `/api/admin/orders` - order data validation
   - `/api/blog` POST/PUT - content validation

2. **Add Validation to All API Routes**
   - `/api/ai-assistant` - message validation
   - `/api/heartbeat` - visitor data validation
   - `/api/contact` - already has Zod (verify completeness)
   - Any remaining routes accepting user input

3. **Improve Error Responses**
   - Field-specific validation error messages
   - Consistent error response format
   - User-friendly error messages

4. **Production Logging Cleanup**
   - Replace 10 console.log statements with Sentry
   - Structured logging with appropriate levels
   - Remove any PII from logs

### Exit Criteria
- All API routes have Zod input validation
- Consistent error response format
- No console.log in production code
- Structured logging via Sentry

### **Duration**: 2-3 hours

---

## Execution Strategy

### **Parallel Execution**
- **Phase 4 & 5**: Start IMMEDIATELY in parallel (both CRITICAL)
- **Phase 6**: Start after Phase 4 complete (independent of Phase 5)
- **Phase 7**: Start after Phases 4 & 5 complete

### **Quality Gates per Phase**
1. `npx tsc --noEmit` clean
2. `npm run build` successful
3. Existing tests still pass
4. Manual security testing
5. Atomic commits with clear messages

### **Risk Management**
- Each fix tested immediately before next change
- Feature branches for major changes (bundle optimization)
- Rollback plan for each atomic commit
- No breaking changes to user-facing functionality

---

## Overall Timeline

**Total Estimated Duration**: 8-10 hours
- **Critical fixes** (Phases 4 & 5): 3-5 hours
- **High priority** (Phase 6): 3-4 hours
- **Medium priority** (Phase 7): 2-3 hours

**Approach**: Aggressive but safe - rapid security fixes with thorough testing

---

## Final Verification Gate

### Security Verification
- [ ] Manual testing of all admin routes (unauthorized access blocked)
- [ ] RLS policies tested with different user roles
- [ ] No hardcoded secrets or PII in logs
- [ ] Input validation tested on all API routes

### Technical Verification
- [ ] `npx tsc --noEmit` passes clean
- [ ] `npm run build` successful with reduced bundle
- [ ] All E2E tests still pass
- [ ] Performance maintained or improved

### Business Verification
- [ ] All existing functionality preserved
- [ ] No breaking changes to user experience
- [ ] Admin panel still functional
- [ ] Checkout flow still works

**Target Security Grade**: B → A+ (comprehensive security overhaul)
