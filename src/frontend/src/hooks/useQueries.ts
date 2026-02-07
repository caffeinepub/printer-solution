import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Client, Product, Quotation, LedgerEntry, UserProfile, UserRole, CompanySettings, BillSummary } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: isFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ principal, role }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(principal, role);
    },
  });
}

// Company Settings Queries
export function useGetCompanySettings() {
  const { actor, isFetching } = useActor();

  return useQuery<CompanySettings | null>({
    queryKey: ['companySettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanySettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCompanySettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: CompanySettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCompanySettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
    },
  });
}

// Client Queries
export function useGetAllClients() {
  const { actor, isFetching } = useActor();

  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClient(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Client | null>({
    queryKey: ['client', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getClient(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; contactDetails: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addClient(data.name, data.contactDetails, data.address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; contactDetails: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(data.id, data.name, data.contactDetails, data.address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      productType: string;
      size: string;
      printingSide: string;
      lamination: string;
      spotUV: boolean;
      foiling: boolean;
      defaultQuotationQuantity: bigint;
      pricePerUnit: number;
      quantity: bigint;
      description: string;
      details: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        data.name,
        data.productType,
        data.size,
        data.printingSide,
        data.lamination,
        data.spotUV,
        data.foiling,
        data.defaultQuotationQuantity,
        data.pricePerUnit,
        data.quantity,
        data.description || null,
        data.details || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      productType: string;
      size: string;
      printingSide: string;
      lamination: string;
      spotUV: boolean;
      foiling: boolean;
      defaultQuotationQuantity: bigint;
      pricePerUnit: number;
      quantity: bigint;
      description: string;
      details: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        data.id,
        data.name,
        data.productType,
        data.size,
        data.printingSide,
        data.lamination,
        data.spotUV,
        data.foiling,
        data.defaultQuotationQuantity,
        data.pricePerUnit,
        data.quantity,
        data.description || null,
        data.details || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Quotation Queries
export function useGetAllQuotations() {
  const { actor, isFetching } = useActor();

  return useQuery<Quotation[]>({
    queryKey: ['quotations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuotation(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Quotation | null>({
    queryKey: ['quotation', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getQuotation(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      clientId: bigint;
      product: string;
      productType: string;
      size: string;
      printingSide: string;
      lamination: string;
      spotUV: boolean;
      foiling: boolean;
      pages: bigint;
      paperType: string;
      paperGSM: string;
      pageNumbering: boolean;
      laminationType: string;
      bindingType: string;
      quantity: bigint;
      price: number;
      pricePerUnit: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createQuotation(
        data.clientId,
        data.product,
        data.productType,
        data.size,
        data.printingSide,
        data.lamination,
        data.spotUV,
        data.foiling,
        data.pages,
        data.paperType,
        data.paperGSM,
        data.pageNumbering,
        data.laminationType,
        data.bindingType,
        data.quantity,
        data.price,
        data.pricePerUnit
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useApproveQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveQuotation(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

// Ledger Queries
export function useGetLedgerEntries(clientId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<LedgerEntry[]>({
    queryKey: ['ledgerEntries', clientId?.toString()],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return actor.getLedgerEntries(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useAddLedgerEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { clientId: bigint; description: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLedgerEntry(data.clientId, data.description, data.amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ledgerEntries', variables.clientId.toString()] });
    },
  });
}

// Billing Queries
export function useCreateBill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBill(quotationId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ledgerEntries', data.ledgerEntry.clientId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}
