import TransferService from '../services/TransferService.js';

class TransferController {
  static async getAllTransfers(req, res) {
    const { limit, offset } = req.query;
    const transfers = await TransferService.getAllTransfers(limit, offset);
    res.status(200).json(transfers);
  }

  static async getTransferById(req, res) {
    const { id } = req.params;
    const transfer = await TransferService.getTransferById(id);
    res.status(200).json(transfer);
  }

  static async createTransfer(req, res) {
    const newTransfer = await TransferService.createTransfer(req.body);
    res.status(201).json({
      message: 'Transfer created successfully',
      data: newTransfer,
    });
  }

  static async updateTransferById(req, res) {
    const updatedTransfer = await TransferService.updateTransferById(req.body);
    res.status(200).json({
      message: 'Transfer updated successfully',
      data: updatedTransfer,
    });
  }

  static async deleteTransferById(req, res) {
    const { id } = req.params;
    const deletedTransfer = await TransferService.deleteTransferById(id);
    res.status(200).json({ message: 'Transfer deleted successfully', data: deletedTransfer });
  }
}

export default TransferController;
