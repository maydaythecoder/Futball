"use client";

import { useState } from "react";
import { MOCK_TRANSFERS } from "@/lib/mock-data/transfers";
import { MOCK_PLAYERS } from "@/lib/mock-data/players";
import { Transfer } from "@/lib/types";
import { TransferModal } from "@/components/transfers/transfer-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_FILTERS = ["All", "pending", "completed", "cancelled"];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(MOCK_TRANSFERS);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransfers = transfers.filter(
    (transfer) => statusFilter === "All" || transfer.status === statusFilter
  );

  const handleCreateTransfer = (newTransfer: Partial<Transfer>) => {
    const transfer: Transfer = {
      id: `tr${transfers.length + 1}`,
      playerId: newTransfer.playerId!,
      playerName: newTransfer.playerName,
      fromTeam: newTransfer.fromTeam!,
      toTeam: newTransfer.toTeam!,
      transferDate: newTransfer.transferDate!,
      fee: newTransfer.fee,
      status: newTransfer.status || "pending",
      initiatedBy: "admin1",
      createdAt: new Date(),
    };

    setTransfers([transfer, ...transfers]);
  };

  const handleStatusChange = (transferId: string, newStatus: Transfer["status"]) => {
    setTransfers(
      transfers.map((t) => (t.id === transferId ? { ...t, status: newStatus } : t))
    );
  };

  const getStatusIcon = (status: Transfer["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: Transfer["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const pendingCount = transfers.filter((t) => t.status === "pending").length;
  const completedCount = transfers.filter((t) => t.status === "completed").length;
  const totalValue = transfers
    .filter((t) => t.status === "completed" && t.fee)
    .reduce((sum, t) => sum + (t.fee || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground">Manage player transfers between teams</p>
        </div>
        <TransferModal players={MOCK_PLAYERS} onSubmit={handleCreateTransfer} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Transfers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(totalValue / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Select>
        <p className="text-sm text-muted-foreground">
          Showing {filteredTransfers.length} of {transfers.length} transfers
        </p>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransfers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.playerName}</TableCell>
                    <TableCell>{transfer.fromTeam}</TableCell>
                    <TableCell>{transfer.toTeam}</TableCell>
                    <TableCell>
                      {transfer.fee ? `€${(transfer.fee / 1000000).toFixed(1)}M` : "Free"}
                    </TableCell>
                    <TableCell>{format(transfer.transferDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transfer.status)}
                        <Badge variant={getStatusVariant(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transfer.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(transfer.id, "completed")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(transfer.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No transfers match your filters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

