# Aderyn Security Audit Report
**Contract:** VaultV1.sol  
**Date:** 2026-04-22  
**Tool:** Aderyn v0.1.9

## High Severity Findings

### H-01: Uninitialized Implementation
**Location:** VaultV1.sol  
**Description:** Without `_disableInitializers()` in the constructor, 
the implementation contract could be initialized by an attacker.  
**Status:** ✅ FIXED — Added `_disableInitializers()` in constructor.

## Medium Severity Findings

### M-01: Reentrancy Risk in withdraw()
**Location:** VaultV1.sol — withdraw() function  
**Description:** External call to user address could allow reentrancy.  
**Status:** ✅ FIXED — Added `nonReentrant` modifier and 
state is reset before transfer (Checks-Effects-Interactions pattern).

### M-02: Integer Overflow in calculateReward()
**Location:** VaultV1.sol — calculateReward() function  
**Description:** Multiplication of large values could overflow.  
**Status:** ✅ FIXED — Using Solidity 0.8.20 which has 
built-in overflow protection.

## Low Severity Findings

### L-01: Timestamp Dependency
**Location:** VaultV1.sol — calculateReward()  
**Description:** block.timestamp can be manipulated by miners 
by a few seconds.  
**Status:** ⚠️ ACKNOWLEDGED — Acceptable for reward calculation 
with small time windows.

## Summary
| Severity | Found | Fixed |
|----------|-------|-------|
| High     | 1     | 1     |
| Medium   | 2     | 2     |
| Low      | 1     | 0     |